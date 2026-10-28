/** What createNormalizedStatus returns. */
export type NormalizedStatus = 'Active' | 'Inactive' | 'No status found';

/**
 * Raw statuses that count as Active. Each entry is lowercase, trimmed and single-spaced,
 * because the raw status is normalized that way before the lookup. Anything not listed is
 * Inactive, so a status with a caveat stays Inactive unless it is added here.
 */
export const VALID_STATUSES: readonly string[] = Object.freeze([
    'active', 'active-current', 'active-existing', 'active-good standing',
    'revived', 'in existence', 'good standing', 'goodstanding', 'active and in good standing',
    'fictitious active', 'incorporated', 'act', 'exists', 'active / in good standing', 'active - in good standing',
    'incorporated/qualified/registered', 'active/compliance', 'current-active', 'current - active',
    'a - active', 'restored to good standing', 'good', 'reinstated', 'in use', 'a - active good', 'organized',
    'this business is in good standing', 'effective', 'registered', 'reserved',
    'igs', 'in good standing', // IGS = "In Good Standing" (Wisconsin abbreviation)
    'legally existing', 'active - registered', 'legacy status - active', 'new corporation', 'perpetual',
    'revival - legally existing'
]);

/**
 * 'Active' when the raw status is on VALID_STATUSES (ignoring case and extra whitespace),
 * 'Inactive' when it is not, and 'No status found' when it is missing or blank.
 * State-specific rules (Hawaii's status code suffix, TX franchise tax, TN/MI standing)
 * belong to the caller, on top of this.
 */
export function createNormalizedStatus(status: string | null | undefined): NormalizedStatus {
    const normalizedStatus = status?.replace(/\s+/g, ' ').trim().toLowerCase();
    if (!normalizedStatus) {
        return 'No status found';
    }
    return VALID_STATUSES.includes(normalizedStatus) ? 'Active' : 'Inactive';
}
