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
 * entityKey mirrors how the primary-row key is built, not which businesses
 * the insert Lambda handler accepts. In particular it deliberately returns a
 * key for a business that has a sosId but an empty or missing title, even
 * though the handler's title filter (lines 106-109) drops a titleless
 * business before anything is written. The sosId key does not contain the
 * title, and sosId# rows with empty titles do exist in the table (Minnesota
 * rows, for example). So a non-null key does not mean the insert Lambda would
 * write the business.
 *
 * Returns null only in these cases:
 * - no business at all;
 * - a falsy state, which the handler also drops (lines 110-113);
 * - a state containing ':', which could not be split back out of the key;
 * - no sosId and no non-blank normalizedFilingDate (the Lambda throws at 251);
 * - no sosId and no title, since the title form needs a title.
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
    // No title check on this path: see the docstring on titleless businesses.
    const sosId = stringField(business.sosId);
    if (sosId) {
        return `${state}:${SOS_ID_PREFIX}${sosId.toLocaleUpperCase()}`;
    }

    // Lines 248-252: no sosId falls back to the trimmed normalizedFilingDate,
    // and with neither the Lambda throws and writes nothing.
    const filingDate = stringField(business.normalizedFilingDate)?.trim();
    if (!filingDate) return null;

    // The title form needs a title: without one the sk would be
    // `title##filingDate#...`, which parseEntityKey rejects. (The handler's
    // title filter at lines 106-109 drops every titleless business; entityKey
    // applies it only here.) The title is uppercased at 149 and 260 and never
    // trimmed.
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
 * This is a structural parser. It returns null for a key with no ':', an
 * empty state, an unknown prefix (neither `sosId#` nor `title#`), an empty
 * sosId, or a title key missing its title or its filing-date part (such as the
 * unsuffixed CA `title#` duplicates). It does not check case or whitespace,
 * so a non-null result does not mean entityKey could have built the key: a
 * lowercase sosId or title, for example, parses as it stands.
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
