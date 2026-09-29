import { entityKey, parseEntityKey, type EntityKeyInput } from './entityKey';
import { entityKey as exportedEntityKey, parseEntityKey as exportedParseEntityKey } from './index';
import { States } from './models';

// Builds an input with a plain string state, since test partitions such as
// WA_TEST are not in the States enum but do exist in the table.
function biz(state: string | undefined, fields: Omit<EntityKeyInput, 'stateOfSosRegistration'> = {}): EntityKeyInput {
    return { stateOfSosRegistration: state as States | undefined, ...fields };
}

// One fixture per key shape in lambda-sos-search docs/plans/business-identity/DISCOVERY.md
// section 7, most taken from the sampled rows in 7.4.
const fixtures: Array<{ name: string; input: EntityKeyInput; key: string }> = [
    {
        name: 'IL entity type after a space',
        input: biz('IL', { sosId: '01234567 LLC', title: 'First Holdings LLC' }),
        key: 'IL:sosId#01234567 LLC'
    },
    {
        name: 'MN entity-type code after a space',
        input: biz('MN', { sosId: '42914-LLC 44', title: 'North Star Widgets LLC' }),
        key: 'MN:sosId#42914-LLC 44'
    },
    {
        name: 'MN lowercase GUID with an empty title',
        input: biz('MN', { sosId: '5006d203-a4d4-e011-a886-001ec94ffe7f', title: '' }),
        key: 'MN:sosId#5006D203-A4D4-E011-A886-001EC94FFE7F'
    },
    {
        name: 'VT entity-type word',
        input: biz('VT', { sosId: '002281 DOMESTIC', title: 'THOMAS CHITTENDEN HEALTH CENTER, PLC' }),
        key: 'VT:sosId#002281 DOMESTIC'
    },
    {
        name: 'VT several entity-type words',
        input: biz('VT', { sosId: '000554 DOMESTIC LIMITED LIABILITY COMPANY', title: 'APPLE CONSTRUCTION, LLC' }),
        key: 'VT:sosId#000554 DOMESTIC LIMITED LIABILITY COMPANY'
    },
    {
        name: 'ME one-letter suffix',
        input: biz('ME', { sosId: '18110000 N', title: 'FIRST BAPTIST CHURCH OF KITTERY POINT' }),
        key: 'ME:sosId#18110000 N'
    },
    {
        name: 'WA UBI with internal spaces',
        input: biz('WA', { sosId: '604 753 869', title: 'ELEVATION LAWN CARE LLC' }),
        key: 'WA:sosId#604 753 869'
    },
    {
        name: 'WA_TEST partition',
        input: biz('WA_TEST', { sosId: '000 000 004', title: 'PIQUNIQ MANAGEMENT CORPORATION' }),
        key: 'WA_TEST:sosId#000 000 004'
    },
    {
        name: 'GA PENDING- placeholder, lowercase in the attribute',
        input: biz('GA', { sosId: 'pending-000495c9-9661-41ad-a655-5002d6ab1b47', title: 'OVO MADE IT, LLC' }),
        key: 'GA:sosId#PENDING-000495C9-9661-41AD-A655-5002D6AB1B47'
    },
    {
        name: 'AZ numeric sosId',
        input: biz('AZ', { sosId: 23395892, title: 'FREEBIRD EC LLC' }),
        key: 'AZ:sosId#23395892'
    },
    {
        name: 'lowercase sosId',
        input: biz('CA', { sosId: 'b20260252230', title: 'Sunshine Cleaners LLC' }),
        key: 'CA:sosId#B20260252230'
    },
    {
        name: 'sosId with a second # after the prefix',
        input: biz('AZ', { sosId: '123456#7', title: 'HASH IN ID LLC' }),
        key: 'AZ:sosId#123456#7'
    },
    {
        name: 'PA style: no sosId, filing date present',
        input: biz('PA', { title: 'Keystone Diner Inc', normalizedFilingDate: '2004-06-15' }),
        key: 'PA:title#KEYSTONE DINER INC#filingDate#2004-06-15'
    },
    {
        name: 'title containing #',
        input: biz('PA', { title: 'Apartment #4 Holdings LLC', normalizedFilingDate: '2019-03-04' }),
        key: 'PA:title#APARTMENT #4 HOLDINGS LLC#filingDate#2019-03-04'
    },
    {
        name: 'empty-string sosId falls back to the filing-date form',
        input: biz('MS', { sosId: '', title: 'Magnolia Feed Store', normalizedFilingDate: '1998-11-02' }),
        key: 'MS:title#MAGNOLIA FEED STORE#filingDate#1998-11-02'
    },
    {
        name: 'null sosId falls back to the filing-date form',
        input: biz('SC', { sosId: null, title: 'Palmetto Tile LLC', normalizedFilingDate: '2011-01-20' }),
        key: 'SC:title#PALMETTO TILE LLC#filingDate#2011-01-20'
    }
];

describe('entityKey()', () => {
    it.each(fixtures)('$name', ({ input, key }) => {
        expect(entityKey(input)).toBe(key);
    });

    it('gives a numeric sosId the same key as its string form', () => {
        expect(entityKey(biz('AZ', { sosId: 23395892 }))).toBe(entityKey(biz('AZ', { sosId: '23395892' })));
    });

    it('does not split, collapse or trim anything in the sosId', () => {
        expect(entityKey(biz('WA', { sosId: ' 604  753 869 ' }))).toBe('WA:sosId# 604  753 869 ');
    });

    it('does not trim the title but does trim the filing date', () => {
        expect(entityKey(biz('PA', { title: '  Keystone Diner  ', normalizedFilingDate: ' 2004-06-15 ' })))
            .toBe('PA:title#  KEYSTONE DINER  #filingDate#2004-06-15');
    });

    it('does not uppercase or trim the state', () => {
        expect(entityKey(biz('il', { sosId: 'x1' }))).toBe('il:sosId#X1');
    });

    // The insert Lambda handler drops a titleless business before writing
    // anything; entityKey deliberately does not, because it mirrors the
    // primary-row key, which does not contain the title.
    it('returns a sosId key for a business with an empty or missing title, mirroring the primary-row key rather than the handler title filter', () => {
        expect(entityKey(biz('MN', { sosId: '42914-LLC 44' }))).toBe('MN:sosId#42914-LLC 44');
        expect(entityKey(biz('MN', { sosId: '42914-LLC 44', title: '' }))).toBe('MN:sosId#42914-LLC 44');
        expect(entityKey(biz('MN', { sosId: '42914-LLC 44', title: null as unknown as string }))).toBe('MN:sosId#42914-LLC 44');
    });

    it('returns null when there is neither a sosId nor a filing date', () => {
        expect(entityKey(biz('PA', { title: 'Keystone Diner Inc' }))).toBeNull();
        expect(entityKey(biz('PA', { sosId: '', title: 'Keystone Diner Inc', normalizedFilingDate: '' }))).toBeNull();
    });

    it('returns null when the filing date is only whitespace', () => {
        expect(entityKey(biz('PA', { title: 'Keystone Diner Inc', normalizedFilingDate: '   ' }))).toBeNull();
    });

    it('returns null when the state is missing or empty', () => {
        expect(entityKey(biz(undefined, { sosId: '01234567 LLC', title: 'First Holdings LLC' }))).toBeNull();
        expect(entityKey(biz('', { sosId: '01234567 LLC', title: 'First Holdings LLC' }))).toBeNull();
    });

    it('returns null when the filing-date form is needed and the title is missing', () => {
        expect(entityKey(biz('PA', { normalizedFilingDate: '2004-06-15' }))).toBeNull();
        expect(entityKey(biz('PA', { title: '', normalizedFilingDate: '2004-06-15' }))).toBeNull();
    });

    it('returns null for a state containing a colon, which could not be parsed back', () => {
        expect(entityKey(biz('I:L', { sosId: '1' }))).toBeNull();
    });

    it('returns null for no business at all', () => {
        expect(entityKey(null)).toBeNull();
        expect(entityKey(undefined)).toBeNull();
    });

    it('does not mutate its input', () => {
        const input = biz('GA', { sosId: 'pending-abc', title: 'lower case llc', normalizedFilingDate: ' 2020-01-01 ' });
        const copy = { ...input };
        entityKey(input);
        expect(input).toEqual(copy);
    });

    it('is exported from the package entry point', () => {
        expect(exportedEntityKey).toBe(entityKey);
        expect(exportedParseEntityKey).toBe(parseEntityKey);
    });
});

describe('parseEntityKey()', () => {
    it('keeps spaces in a sosId key', () => {
        expect(parseEntityKey('IL:sosId#01234567 LLC')).toEqual({ state: 'IL', kind: 'sosId', sosId: '01234567 LLC' });
        expect(parseEntityKey('WA:sosId#604 753 869')).toEqual({ state: 'WA', kind: 'sosId', sosId: '604 753 869' });
    });

    it('does not split a sosId key on # after the prefix', () => {
        expect(parseEntityKey('AZ:sosId#123456#7')).toEqual({ state: 'AZ', kind: 'sosId', sosId: '123456#7' });
    });

    it('splits only on the first colon', () => {
        expect(parseEntityKey('XX:sosId#A:B')).toEqual({ state: 'XX', kind: 'sosId', sosId: 'A:B' });
        expect(parseEntityKey('PA:title#RATIO 3:1 LLC#filingDate#2001-02-03'))
            .toEqual({ state: 'PA', kind: 'titleFilingDate', title: 'RATIO 3:1 LLC', filingDate: '2001-02-03' });
    });

    it('splits a title key on the last #filingDate#', () => {
        expect(parseEntityKey('PA:title#APARTMENT #4 HOLDINGS LLC#filingDate#2019-03-04'))
            .toEqual({ state: 'PA', kind: 'titleFilingDate', title: 'APARTMENT #4 HOLDINGS LLC', filingDate: '2019-03-04' });
        expect(parseEntityKey('PA:title#A#filingDate#B#filingDate#2019-03-04'))
            .toEqual({ state: 'PA', kind: 'titleFilingDate', title: 'A#filingDate#B', filingDate: '2019-03-04' });
    });

    it('returns null for structurally malformed keys', () => {
        expect(parseEntityKey('')).toBeNull();
        expect(parseEntityKey('sosId#123')).toBeNull();
        expect(parseEntityKey(':sosId#123')).toBeNull();
        expect(parseEntityKey('IL:')).toBeNull();
        expect(parseEntityKey('IL:sosId#')).toBeNull();
        expect(parseEntityKey('IL:agentOrOfficer#JOHN SMITH#sosId#1')).toBeNull();
        expect(parseEntityKey('IL:updatedAt#1727000000000#sosId#1')).toBeNull();
        // The unsuffixed CA title# duplicates from DISCOVERY 7.4.
        expect(parseEntityKey('CA:title#SUNSHINE CLEANERS LLC')).toBeNull();
        expect(parseEntityKey('PA:title##filingDate#2004-06-15')).toBeNull();
        expect(parseEntityKey('PA:title#KEYSTONE DINER INC#filingDate#')).toBeNull();
        expect(parseEntityKey(null)).toBeNull();
        expect(parseEntityKey(undefined)).toBeNull();
    });
});

describe('entityKey round trip', () => {
    it.each(fixtures)('$name', ({ input }) => {
        const key = entityKey(input);
        expect(key).not.toBeNull();
        const parsed = parseEntityKey(key);
        expect(parsed).not.toBeNull();
        expect(parsed!.state).toBe(String(input.stateOfSosRegistration));

        const sosId = input.sosId === undefined || input.sosId === null ? '' : String(input.sosId);
        if (sosId) {
            expect(parsed).toEqual({ state: parsed!.state, kind: 'sosId', sosId: sosId.toLocaleUpperCase() });
        } else {
            expect(parsed).toEqual({
                state: parsed!.state,
                kind: 'titleFilingDate',
                title: String(input.title).toLocaleUpperCase(),
                filingDate: String(input.normalizedFilingDate).trim()
            });
        }
        expect(`${parsed!.state}:${parsed!.kind === 'sosId' ? `sosId#${parsed!.sosId}` : `title#${parsed!.title}#filingDate#${parsed!.filingDate}`}`).toBe(key);
    });
});

// Pinned against the insert Lambda. Every expected value below was worked out
// by hand from insert-to-sos-businesses-vXXX src/index.ts at origin/master
// dd78618, not by running entityKey:
//   lines 105-115  a business with a falsy title or stateOfSosRegistration is dropped
//   lines 122-128  stringFields (454-499): String(value) for title, state, sosId, normalizedFilingDate
//   lines 149-152  title, and sosId when a string, get toLocaleUpperCase()
//   lines 246-252  truthy sosId: uniqueSuffix #sosId#<SOSID>; else trimmed
//                  normalizedFilingDate: #filingDate#<DATE>; else throw (no write)
//   lines 258-260  probe (primary) row sk: sosId#<SOSID>, or title#<TITLE><uniqueSuffix>
//   line 264, 441  pk is stateOfSosRegistration as sent, not uppercased
//   line 329       the probe row is written last, as the commit record
//   lines 357-358  contentRowSks writes the same unsuffixed sosId# key
// entityKey mirrors the state drop at 110-113 but deliberately not the title
// drop at 106-109 when a sosId is present, since the primary-row key does not
// contain the title. That case is tested in the entityKey() block above, not
// pinned here, because the Lambda itself writes nothing for it.
// If the insert Lambda changes how it builds any of these, entityKey must
// change with it and these pins must be re-derived. If entityKey drifts on its
// own, these fail.
describe('entityKey pinned to the insert Lambda key rules', () => {
    const pins: Array<[string, EntityKeyInput, string | null]> = [
        // 122-128 String(23395892) = '23395892'; 150-152 no letters to uppercase; 259.
        ['numeric sosId', biz('AZ', { sosId: 23395892, title: 'x' }), 'AZ:sosId#23395892'],
        // String(0) = '0' is truthy at 246, so the sosId form wins over the filing date.
        ['numeric zero sosId', biz('AZ', { sosId: 0, title: 'x', normalizedFilingDate: '2020-01-01' }), 'AZ:sosId#0'],
        // 151 uppercases; 259 builds sosId#; spaces kept since nothing trims or splits.
        ['IL suffix, lowercase', biz('IL', { sosId: '01234567 llc', title: 'x' }), 'IL:sosId#01234567 LLC'],
        // 246 takes any truthy string, whitespace included; nothing trims it.
        ['whitespace sosId', biz('WA', { sosId: '  ', title: 'x' }), 'WA:sosId#  '],
        // 246 falsy '' -> 248 trims ' 2004-06-15 '; 149 and 260 uppercase the untrimmed title.
        ['empty sosId, padded date', biz('PA', { sosId: '', title: ' Keystone ', normalizedFilingDate: ' 2004-06-15 ' }), 'PA:title# KEYSTONE #filingDate#2004-06-15'],
        // 122-128 String(20040615) then 249 trim.
        ['numeric filing date', biz('PA', { title: 'Keystone', normalizedFilingDate: 20040615 as unknown as string }), 'PA:title#KEYSTONE#filingDate#20040615'],
        // 248 '   '.trim() is falsy -> 251 throws, nothing written.
        ['blank filing date', biz('PA', { title: 'Keystone', normalizedFilingDate: '   ' }), null],
        // 110-113 falsy state is dropped.
        ['no state', biz(undefined, { sosId: '1', title: 'x' }), null],
        // 264 and 441 use the state as sent.
        ['lowercase state', biz('ga', { sosId: 'pending-1', title: 'x' }), 'ga:sosId#PENDING-1']
    ];

    it.each(pins)('%s', (_name, input, expected) => {
        expect(entityKey(input)).toBe(expected);
    });
});
