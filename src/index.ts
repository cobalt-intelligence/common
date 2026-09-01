export { States, Status } from './models';
export type { IBusiness, IAddress, IOfficer, IDocument, IUCCData, IDebtor, ISecuredParty, IResponseBody, IAssumedBusinessName, IUccResult, IUccResponseBody } from './models';
export { abbreviateState } from './state';
export { createUccResponseBody, UCC_RESULT_FOUND, UCC_RESULT_NONE, UCC_RESULT_ERROR } from './ucc';
// Format the business name to remove commas, remove periods, lowercase, and trim white space
// I know you're looking at that empty replace thinking, what the heck? Why is that there? Do NOT remove it.
// It's removing invisible delimiters. You can't see them. Invisible.
// Or do remove it and see the tests fail. I dare you.
export function formatBusinessName(businessName: string) {
    if (businessName) {
        return businessName
        // Remove characters entirely
        .replace(/[,.’'".‎\u200E\u200F\u00A0]/g, '')
        // Replace & with "and"
        .replace(/&/g, 'and')
        // Collapse any whitespace runs to a single space
        .replace(/\s+/g, ' ')
        .toLocaleLowerCase()
        .trim();
    }
    else {
        return null;
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