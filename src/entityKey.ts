import type { IBusiness } from './models';

/**
 * The fields entityKey reads. sosId is widened to number because some rows
 * (about 19 percent of AZ) store it as a DynamoDB Number; the insert Lambda
 * stringifies it before it builds the key, and so does entityKey.
 */
export type EntityKeyInput = Pick<IBusiness, 'stateOfSosRegistration' | 'title' | 'normalizedFilingDate'> & {
    sosId?: IBusiness['sosId'] | number | null;
};

/**
 * A parsed entityKey. Both members declare every field so callers can read
 * parsed.sosId or parsed.title without narrowing first; checking `kind`
 * narrows to the fields that are set.
 */
export type ParsedEntityKey =
    | { state: string; kind: 'sosId'; sosId: string; title?: undefined; filingDate?: undefined }
    | { state: string; kind: 'titleFilingDate'; title: string; filingDate: string; sosId?: undefined };

const SOS_ID_PREFIX = 'sosId#';
const TITLE_PREFIX = 'title#';
const FILING_DATE_SEPARATOR = '#filingDate#';

// Line numbers below refer to insert-to-sos-businesses-vXXX src/index.ts at
// origin/master dd78618, the only writer whose keys land in the table.

// The handler's stringFields pass (lines 122-128): any value that is not
// undefined or null becomes String(value). title, stateOfSosRegistration,
// sosId and normalizedFilingDate are all in stringFields (lines 454-499).
function stringField(value: unknown): string | undefined {
    return value === undefined || value === null ? undefined : String(value);
}

/**
 * The stable key for one SOS registration: `${state}:${sk}`, where sk is the
 * sort key of the primary row the insert Lambda writes for the business
 * (its probe row, lines 258-260 and 329):
 *
 * - `sosId#<SOSID>` when the business has a sosId. The sosId is taken verbatim
 *   after String() and toLocaleUpperCase(), so IL and MN keep their
 *   entity-type suffix after a space, WA UBIs keep their internal spaces, and
 *   a numeric AZ sosId gives the same key as its string form.
 * - `title#<TITLE>#filingDate#<DATE>` when it has no sosId, with the title
 *   uppercased (not trimmed) and normalizedFilingDate trimmed, exactly as the
 *   insert Lambda builds it.
 *
 * Returns null when the insert Lambda would refuse the business (a falsy
 * state, or neither a sosId nor a non-blank normalizedFilingDate, which is
 * the throw at line 251), or when the title form is needed and there is no
 * title. A missing title does not block the sosId form: that key does not
 * contain the title, and sosId# rows with an empty title exist (MN GUID rows).
 */
export function entityKey(business: EntityKeyInput | null | undefined): string | null {
    if (!business) return null;

    // Lines 110-113 drop a business with a falsy state before anything is
    // written. The partition key is the state as sent (lines 264, 441): the
    // Lambda never uppercases or trims it, so neither does this.
    if (!business.stateOfSosRegistration) return null;
    const state = String(business.stateOfSosRegistration);
    // The key is split back on its first ':', so a state containing one could
    // not be recovered. No state partition does; refuse rather than mislead.
    if (state.includes(':')) return null;

    // Lines 150-152 uppercase a string sosId, then lines 246 and 258 pick the
    // sosId form on a truthy sosId and uppercase it again at 247 and 259.
    // toLocaleUpperCase is idempotent, so once is the same as twice. String(0)
    // is "0", which is truthy, so a numeric 0 takes the sosId form as it does
    // in the Lambda.
    const sosId = stringField(business.sosId);
    if (sosId) {
        return `${state}:${SOS_ID_PREFIX}${sosId.toLocaleUpperCase()}`;
    }

    // Lines 248-252: no sosId falls back to the trimmed normalizedFilingDate,
    // and with neither the Lambda throws and writes nothing.
    const filingDate = stringField(business.normalizedFilingDate)?.trim();
    if (!filingDate) return null;

    // Lines 106-108 drop a business with a falsy title. The title form needs
    // one; it is uppercased at 149 and 260 and never trimmed.
    if (!business.title) return null;
    const title = String(business.title).toLocaleUpperCase();

    return `${state}:${TITLE_PREFIX}${title}${FILING_DATE_SEPARATOR}${filingDate}`;
}

/**
 * Splits an entityKey back into its parts. The state is everything before the
 * first ':'. A sosId key keeps everything after `sosId#` verbatim, spaces and
 * any further '#' included. A title key splits on the last `#filingDate#`,
 * since a title may itself contain '#'. (An uppercased title can never contain
 * the lowercase separator, so for keys entityKey builds, first and last agree.)
 *
 * Returns null for anything entityKey cannot produce: no ':', an empty state,
 * an unknown prefix, an empty sosId, or a title key missing its title or
 * filing date (such as the unsuffixed CA `title#` duplicates).
 */
export function parseEntityKey(key: string | null | undefined): ParsedEntityKey | null {
    if (typeof key !== 'string') return null;

    const colon = key.indexOf(':');
    if (colon <= 0) return null;
    const state = key.slice(0, colon);
    const sk = key.slice(colon + 1);

    if (sk.startsWith(SOS_ID_PREFIX)) {
        const sosId = sk.slice(SOS_ID_PREFIX.length);
        return sosId ? { state, kind: 'sosId', sosId } : null;
    }

    if (sk.startsWith(TITLE_PREFIX)) {
        const rest = sk.slice(TITLE_PREFIX.length);
        const at = rest.lastIndexOf(FILING_DATE_SEPARATOR);
        // -1: no filing date at all; 0: empty title.
        if (at <= 0) return null;
        const title = rest.slice(0, at);
        const filingDate = rest.slice(at + FILING_DATE_SEPARATOR.length);
        return filingDate ? { state, kind: 'titleFilingDate', title, filingDate } : null;
    }

    return null;
}
