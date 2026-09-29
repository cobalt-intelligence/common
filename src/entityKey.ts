import type { IBusiness } from './models';

/** The fields entityKey reads. sosId also takes a number because some AZ rows store it as one. */
export type EntityKeyInput = Pick<IBusiness, 'title' | 'normalizedFilingDate'> & {
    // Widened to string: this helper preserves arbitrary partitions (e.g. WA_TEST) not in the States enum.
    stateOfSosRegistration?: IBusiness['stateOfSosRegistration'] | string | null;
    sosId?: IBusiness['sosId'] | number | null;
};

/** A parsed entityKey. Both members declare every field so any can be read without narrowing. */
export type ParsedEntityKey =
    | { state: string; kind: 'sosId'; sosId: string; title?: undefined; filingDate?: undefined }
    | { state: string; kind: 'titleFilingDate'; title: string; filingDate: string; sosId?: undefined };

const SOS_ID_PREFIX = 'sosId#';
const TITLE_PREFIX = 'title#';
const FILING_DATE_SEPARATOR = '#filingDate#';

function stringField(value: unknown): string | undefined {
    return value === undefined || value === null ? undefined : String(value);
}

/**
 * Returns `${state}:${sk}`, where sk is the primary-row sort key the insert-to-sos-businesses
 * Lambda builds for this business, or null when no such key can be built.
 */
export function entityKey(business: EntityKeyInput | null | undefined): string | null {
    if (!business) return null;

    if (!business.stateOfSosRegistration) return null;
    // The state is used as sent: the insert Lambda never uppercases or trims it.
    const state = String(business.stateOfSosRegistration);
    // parseEntityKey splits on the first ':', so a state containing one could not round trip.
    if (state.includes(':')) return null;

    // Deliberately no title check: the sosId form of the key does not contain the title.
    const sosId = stringField(business.sosId);
    if (sosId) {
        return `${state}:${SOS_ID_PREFIX}${sosId.toLocaleUpperCase()}`;
    }

    const filingDate = stringField(business.normalizedFilingDate)?.trim();
    if (!filingDate) return null;

    if (!business.title) return null;
    // Uppercased but not trimmed, as the insert Lambda does (unlike the filing date).
    const title = String(business.title).toLocaleUpperCase();

    return `${state}:${TITLE_PREFIX}${title}${FILING_DATE_SEPARATOR}${filingDate}`;
}

/**
 * Splits an entityKey back into its parts, splitting a title key on its last `#filingDate#`.
 * Returns null for a structurally malformed key; case and whitespace are not checked.
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
