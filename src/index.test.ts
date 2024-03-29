import { abbreviateState, formatBusinessName } from '.';
import { States } from './models';

describe('abbreviateState()', () => {
    it('should return a state from the Enum', () => {
        expect(abbreviateState('Arizona')).toBe(States.AZ);
    });

    it('should return a state from the enum regardless of casing', () => {
        expect(abbreviateState('wAshingtOn')).toBe(States.WA);
    });

    it('should return a state from the enum even if the state has a space in it', () => {
        expect(abbreviateState('North Carolina')).toBe(States.NC);
    });

    it('should return a state from the enum even if the state is camelCased', () => {
        expect(abbreviateState('northCarolina')).toBe(States.NC);
    });

    it('should return undefined if it does not recognize the state', () => {
        expect(abbreviateState('North Carolinaz')).toBe(undefined);
    });

    it('should handle the districtOfColumbia camelCased', () => {
        expect(abbreviateState('districtOfColumbia')).toBe(States.DC);
    });

    it('should handle the "District of Columbia" with spaces', () => {
        expect(abbreviateState('District of Columbia')).toBe(States.DC);
    });

    it('should handle the districtOfColumbia abbreviated', () => {
        expect(abbreviateState('dc')).toBe(States.DC);
    });
});

describe('formatBusinessName()', () => {
    it('should return a business name without any commas', () => {
        expect(formatBusinessName('Aarmora, LLC')).toBe('aarmora llc');
    });

    it('should return a business name without any periods', () => {
        expect(formatBusinessName('Aarmora, L.L.C.')).toBe('aarmora llc');
    });

    it('should return a business name fully lower cased', () => {
        expect(formatBusinessName('AARMORA, L.L.C.')).toBe('aarmora llc');
    });

    // You can't tell here but there really are invisible delimiters here
    // Illinois has invisible delimiters in their search results
    it('should return a business name without invisible delimiters', () => {
        expect(formatBusinessName('MONTENARO LLC‎‎‎‎')).toBe('montenaro llc');
    });

    it('should return null if a falsey business name is passed in', () => {
        expect(formatBusinessName('')).toBe(null);
    });
});
