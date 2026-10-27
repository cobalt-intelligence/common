import { createNormalizedStatus, VALID_STATUSES } from './status';
import { createNormalizedStatus as exportedCreateNormalizedStatus, VALID_STATUSES as exportedValidStatuses } from './index';

describe('VALID_STATUSES', () => {
    it('should hold only normalized, unique entries, since a raw status is normalized before the lookup', () => {
        for (const entry of VALID_STATUSES) {
            expect(entry).toBe(entry.replace(/\s+/g, ' ').trim().toLowerCase());
        }
        expect(new Set(VALID_STATUSES).size).toBe(VALID_STATUSES.length);
    });

    it('should not be changeable by a caller', () => {
        expect(Object.isFrozen(VALID_STATUSES)).toBe(true);
    });
});

describe('createNormalizedStatus()', () => {
    it('should return Active for every listed status, whatever the case or spacing', () => {
        for (const entry of VALID_STATUSES) {
            expect(createNormalizedStatus(entry)).toBe('Active');
            expect(createNormalizedStatus(entry.toUpperCase())).toBe('Active');
            expect(createNormalizedStatus(`  ${entry.replace(/ /g, '   ')}\t`)).toBe('Active');
        }
    });

    it('should return Inactive for any status that is not listed, including ones with a caveat', () => {
        for (const status of ['Converted', 'Dissolved', 'Inactive', 'Active/Owes Current Year AR', 'Forfeiture Pending']) {
            expect(createNormalizedStatus(status)).toBe('Inactive');
        }
    });

    it('should match whole statuses only, not a listed status inside a longer one', () => {
        expect(createNormalizedStatus('REVIVAL - LEGALLY EXISTING')).toBe('Inactive');
        expect(createNormalizedStatus('Not in good standing')).toBe('Inactive');
    });

    it('should return No status found for a missing or blank status', () => {
        for (const status of [undefined, null, '', '   ', '\t\n']) {
            expect(createNormalizedStatus(status)).toBe('No status found');
        }
    });

    it('should be exported from the package index', () => {
        expect(exportedCreateNormalizedStatus).toBe(createNormalizedStatus);
        expect(exportedValidStatuses).toBe(VALID_STATUSES);
    });
});
