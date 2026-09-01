import { createUccResponseBody, UCC_RESULT_ERROR, UCC_RESULT_NONE } from './ucc';
import { Status } from './models';

const filing = { fileNumber: '20240001', debtors: [{ name: 'ACME LLC' }], securedParties: [{ name: 'BANK' }], type: 'UCC-1', filingDate: '2024-01-02' };

describe('Status', () => {
    it('should exist at runtime', () => {
        expect(Status.Complete).toBe('Complete');
        expect(Status.Failed).toBe('Failed');
    });
});

describe('createUccResponseBody()', () => {
    it('should return a flat success body with the filings and the two letter state', () => {
        expect(createUccResponseBody({ searchQuery: 'ACME LLC', state: 'Colorado', succeeded: true, uccData: [filing] })).toEqual({
            status: 'Complete',
            statusCode: 200,
            searchQuery: 'ACME LLC',
            state: 'CO',
            uccData: [filing],
            uccDataCount: 1
        });
    });

    it('should accept an abbreviated state', () => {
        expect(createUccResponseBody({ searchQuery: 'ACME LLC', state: 'co', succeeded: true, uccData: [filing] }).state).toBe('CO');
    });

    it('should prefer the supplied total over the length of uccData', () => {
        expect(createUccResponseBody({ succeeded: true, uccData: [filing], uccDataCount: 42 }).uccDataCount).toBe(42);
    });

    it('should add the no-data message for an empty result', () => {
        expect(createUccResponseBody({ searchQuery: 'ACME LLC', state: 'CO', succeeded: true, uccData: [] })).toMatchObject({
            statusCode: 200, uccData: [], uccDataCount: 0, message: UCC_RESULT_NONE
        });
        expect(createUccResponseBody({ succeeded: true }).uccData).toEqual([]);
    });

    it('should return a failed body with the supplied message', () => {
        expect(createUccResponseBody({ searchQuery: 'ACME LLC', state: 'Colorado', succeeded: false, message: UCC_RESULT_ERROR, uccData: [filing] })).toEqual({
            status: 'Failed', statusCode: 500, message: UCC_RESULT_ERROR, searchQuery: 'ACME LLC', state: 'CO'
        });
    });

    it('should fall back to the generic error message on failure', () => {
        expect(createUccResponseBody({ succeeded: false }).message).toBe(UCC_RESULT_ERROR);
    });
});
