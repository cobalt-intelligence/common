import { abbreviateState, formatBusinessName, parseName } from '.';
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

    it('should return undefined if it does not recognize the state', () => {
        expect(abbreviateState('North Carolinaz')).toBe(undefined);
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

describe('parseName()', () => {
    it('should correctly parse "Hansen Jordan"', () => {
        expect(parseName('Hansen Jordan')).toEqual({ firstName: 'Jordan', lastName: 'Hansen' });
    });

    it('should correctly parse "Hansen Jordan Burke"', () => {
        expect(parseName('Hansen Jordan Burke')).toEqual({ firstName: 'Jordan Burke', lastName: 'Hansen' });
    });
    
    it('should correctly parse "Hansen Jordan Burke    "', () => {
        expect(parseName('Hansen Jordan Burke    ')).toEqual({ firstName: 'Jordan Burke', lastName: 'Hansen' });
    });
    
    it('should correctly parse "Hansen, Jordan"', () => {
        expect(parseName('Hansen, Jordan')).toEqual({ firstName: 'Jordan', lastName: 'Hansen' });
    });
    
    it('should correctly parse "Aarmora LLC"', () => {
        expect(parseName('Aarmora LLC')).toEqual({ firstName: 'Aarmora LLC', lastName: '' });
    });
});
