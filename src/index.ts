import { States } from './models';

export { IBusiness, States, IAddress, IOfficer, IDocument, IUCCData, IDebtor, ISecuredParty, IResponseBody, Status, IAssumedBusinessName } from './models';
// Format the business name to remove commas, remove periods, lowercase, and trim white space
// I know you're looking at that empty replace thinking, what the heck? Why is that there? Do NOT remove it.
// It's removing invisible delimiters. You can't see them. Invisible.
// Or do remove it and see the tests fail. I dare you.
export function formatBusinessName(businessName: string) {
    if (businessName) {
        return businessName.replace(/,/g, '').replace(/\./g, '').replace(/‎/g, '').toLocaleLowerCase().trim();
    }
    else {
        return null;
    }
}

/**
 * This function accepts either a full state name in any case or a state abbreviation in any case and will return
 * the correct states enum.
 * 
 * @param stateOrAbbreviation Can be a state, such as "Idaho" or abbreviation, such as "ID"
 */
export function abbreviateState(stateOrAbbreviation: string): States {
    if (!stateOrAbbreviation) {
        return null;
    }

    if (stateOrAbbreviation.toLocaleLowerCase() === 'arizona' || stateOrAbbreviation.toLocaleLowerCase() === 'az') {
        return States.AZ;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'alabama' || stateOrAbbreviation.toLocaleLowerCase() === 'al') {
        return States.AL;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'alaska' || stateOrAbbreviation.toLocaleLowerCase() === 'ak') {
        return States.AK;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'arkansas' || stateOrAbbreviation.toLocaleLowerCase() === 'ar') {
        return States.AR;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'california' || stateOrAbbreviation.toLocaleLowerCase() === 'ca') {
        return States.CA;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'colorado' || stateOrAbbreviation.toLocaleLowerCase() === 'co') {
        return States.CO;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'connecticut' || stateOrAbbreviation.toLocaleLowerCase() === 'ct') {
        return States.CT;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'delaware' || stateOrAbbreviation.toLocaleLowerCase() === 'de') {
        return States.DE;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'districtofcolumbia' || stateOrAbbreviation.toLocaleLowerCase() === 'district of columbia' || stateOrAbbreviation.toLocaleLowerCase() === 'dc') {
        return States.DC;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'florida' || stateOrAbbreviation.toLocaleLowerCase() === 'fl') {
        return States.FL;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'georgia' || stateOrAbbreviation.toLocaleLowerCase() === 'ga') {
        return States.GA;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'hawaii' || stateOrAbbreviation.toLocaleLowerCase() === 'hi') {
        return States.HI;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'idaho' || stateOrAbbreviation.toLocaleLowerCase() === 'id') {
        return States.ID;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'illinois' || stateOrAbbreviation.toLocaleLowerCase() === 'il') {
        return States.IL;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'indiana' || stateOrAbbreviation.toLocaleLowerCase() === 'in') {
        return States.IN;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'iowa' || stateOrAbbreviation.toLocaleLowerCase() === 'ia') {
        return States.IA;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'kansas' || stateOrAbbreviation.toLocaleLowerCase() === 'ks') {
        return States.KS;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'kentucky' || stateOrAbbreviation.toLocaleLowerCase() === 'ky') {
        return States.KY;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'louisiana' || stateOrAbbreviation.toLocaleLowerCase() === 'la') {
        return States.LA;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'maine' || stateOrAbbreviation.toLocaleLowerCase() === 'me') {
        return States.ME;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'maryland' || stateOrAbbreviation.toLocaleLowerCase() === 'md') {
        return States.MD;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'massachusetts' || stateOrAbbreviation.toLocaleLowerCase() === 'ma') {
        return States.MA;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'michigan' || stateOrAbbreviation.toLocaleLowerCase() === 'mi') {
        return States.MI;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'minnesota' || stateOrAbbreviation.toLocaleLowerCase() === 'mn') {
        return States.MN;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'mississippi' || stateOrAbbreviation.toLocaleLowerCase() === 'ms') {
        return States.MS;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'missouri' || stateOrAbbreviation.toLocaleLowerCase() === 'mo') {
        return States.MO;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'montana' || stateOrAbbreviation.toLocaleLowerCase() === 'mt') {
        return States.MT;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'nebraska' || stateOrAbbreviation.toLocaleLowerCase() === 'ne') {
        return States.NE;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'nevada' || stateOrAbbreviation.toLocaleLowerCase() === 'nv') {
        return States.NV;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'newhampshire' || stateOrAbbreviation.toLocaleLowerCase() === 'new hampshire' || stateOrAbbreviation.toLocaleLowerCase() === 'nh') {
        return States.NH;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'newjersey' || stateOrAbbreviation.toLocaleLowerCase() === 'new jersey' || stateOrAbbreviation.toLocaleLowerCase() === 'nj') {
        return States.NJ;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'newmexico' || stateOrAbbreviation.toLocaleLowerCase() === 'new mexico' || stateOrAbbreviation.toLocaleLowerCase() === 'nm') {
        return States.NM;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'newyork' || stateOrAbbreviation.toLocaleLowerCase() === 'new york' || stateOrAbbreviation.toLocaleLowerCase() === 'ny') {
        return States.NY;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'northcarolina' || stateOrAbbreviation.toLocaleLowerCase() === 'north carolina' || stateOrAbbreviation.toLocaleLowerCase() === 'nc') {
        return States.NC;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'northDakota' || stateOrAbbreviation.toLocaleLowerCase() === 'north dakota' || stateOrAbbreviation.toLocaleLowerCase() === 'nd') {
        return States.ND;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'ohio' || stateOrAbbreviation.toLocaleLowerCase() === 'oh') {
        return States.OH;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'oklahoma' || stateOrAbbreviation.toLocaleLowerCase() === 'ok') {
        return States.OK;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'oregon' || stateOrAbbreviation.toLocaleLowerCase() === 'or') {
        return States.OR;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'pennsylvania' || stateOrAbbreviation.toLocaleLowerCase() === 'pa') {
        return States.PA;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'rhodeisland' || stateOrAbbreviation.toLocaleLowerCase() === 'rhode island' || stateOrAbbreviation.toLocaleLowerCase() === 'ri') {
        return States.RI;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'southcarolina' || stateOrAbbreviation.toLocaleLowerCase() === 'south carolina' || stateOrAbbreviation.toLocaleLowerCase() === 'sc') {
        return States.SC;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'southdakota' || stateOrAbbreviation.toLocaleLowerCase() === 'south dakota' || stateOrAbbreviation.toLocaleLowerCase() === 'sd') {
        return States.SD;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'tennessee' || stateOrAbbreviation.toLocaleLowerCase() === 'tn') {
        return States.TN;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'texas' || stateOrAbbreviation.toLocaleLowerCase() === 'tx') {
        return States.TX;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'utah' || stateOrAbbreviation.toLocaleLowerCase() === 'ut') {
        return States.UT;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'vermont' || stateOrAbbreviation.toLocaleLowerCase() === 'vt') {
        return States.VT;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'virginia' || stateOrAbbreviation.toLocaleLowerCase() === 'va') {
        return States.VA;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'washington' || stateOrAbbreviation.toLocaleLowerCase() === 'wa') {
        return States.WA;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'westvirginia' || stateOrAbbreviation.toLocaleLowerCase() === 'west virginia' || stateOrAbbreviation.toLocaleLowerCase() === 'wv') {
        return States.WV;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'wisconsin' || stateOrAbbreviation.toLocaleLowerCase() === 'wi') {
        return States.WI;
    }
    else if (stateOrAbbreviation.toLocaleLowerCase() === 'wyoming' || stateOrAbbreviation.toLocaleLowerCase() === 'wy') {
        return States.WY;
    }
}

/**
 * This will return true if the name contains words that indicate it is a business.
 * 
 * @param name string Name of thing to check for business
 * @returns boolean
 */
export function isBusinessCheck(name: string) {
    if (name.toLocaleLowerCase().includes('trust')
    || name.toLocaleLowerCase().includes('llc')
    || name.toLocaleLowerCase().includes('inc')
    || name.toLocaleLowerCase().includes('ltd')
    || name.toLocaleLowerCase().includes('llp')
    || name.toLocaleLowerCase().includes('estate')
    || name.toLocaleLowerCase().includes('family')
    || name.toLocaleLowerCase().includes('%')
    || name.toLocaleLowerCase().includes('&')
    || name.toLocaleLowerCase().includes(' and ')
    || name.toLocaleLowerCase().includes('heir')
    || name.toLocaleLowerCase().includes(' aka ')
    || name.toLocaleLowerCase().includes(' att ')
    || name.toLocaleLowerCase().includes('c/o')
    || name.toLocaleLowerCase().includes('attn')
    || name.toLocaleLowerCase().includes('dba')
    || name.toLocaleLowerCase().includes('invest')
    || name.toLocaleLowerCase().includes('express')
    || name.toLocaleLowerCase().includes('employment')
    || name.toLocaleLowerCase().includes('#')
    || name.toLocaleLowerCase().includes('corporation')
    || name.toLocaleLowerCase().includes('studio')
    || name.toLocaleLowerCase().includes('bank')
    || name.toLocaleLowerCase().includes('corp')
    || name.toLocaleLowerCase().includes('university')
    || name.toLocaleLowerCase().includes('city')
    || name.toLocaleLowerCase().includes('county')) {
        return true;
    }
    else {
        false;
    }
}

export function timeout(ms: number): Promise<NodeJS.Timeout> {
    return new Promise((res) => setTimeout(res, ms));
}