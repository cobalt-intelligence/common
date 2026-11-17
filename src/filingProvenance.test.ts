import type { IBusiness, IBusinessRow, IFilingExtraction, IOfficer } from './index';

// ts-jest type-checks this file, so the assignments below are the real test: old rows and officers still fit.
describe('officer provenance types', () => {
    it('accepts an officer and a row written before the new fields existed', () => {
        const stateOfficer: IOfficer = { name: 'Jane Doe', title: 'President' };
        const oldRow: IBusinessRow = { title: 'Acme LLC', sosId: '123', officers: [stateOfficer] };
        const asBusiness: IBusiness = oldRow;

        expect(stateOfficer.source).toBeUndefined();
        expect(asBusiness.officers).toEqual([stateOfficer]);
    });

    it('carries filing officers and one extraction record per parsed document', () => {
        const filingOfficer: IOfficer = {
            name: 'John Roe',
            title: 'Chief Executive Officer, Director',
            source: 'filing',
            filing: { documentId: 'https://example.test/filing/1', date: '2026-01-16', type: 'Statement of Information' }
        };
        const extraction: IFilingExtraction = {
            documentId: 'https://example.test/filing/1',
            date: '2026-01-16',
            type: 'Statement of Information',
            model: 'us.anthropic.claude-opus-5-5',
            costCents: 1.6,
            outcome: 'parsed',
            extractedAt: '2026-11-12T00:00:00.000Z',
            inputMode: 'text',
            officerCount: 1
        };
        const row: IBusinessRow = { title: 'Acme LLC', filingOfficers: [filingOfficer], filingExtractions: [extraction] };

        expect(row.filingOfficers?.[0].filing?.documentId).toBe(extraction.documentId);
        expect(row.filingExtractions).toHaveLength(1);
    });
});
