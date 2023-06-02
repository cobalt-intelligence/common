/**
 * This is the format of data returned from sos-search
 */
export interface IBusiness {
    title?: string;
    filingDate?: string;
    stateOfFormation?: States;
    stateOfSosRegistration?: States;
    status?: string;
    agentName?: string;
    agentCity?: string;
    agentState?: States;
    agentZip?: string;
    agentStreetAddress?: string;
    physicalAddressStreet?: string;
    physicalAddressCity?: string;
    physicalAddressState?: string;
    physicalAddressZip?: string;    
    mailingAddressStreet?: string;
    mailingAddressCity?: string;
    mailingAddressState?: string;
    mailingAddressZip?: string;
    stateAddressStreet?: string;
    stateAddressCity?: string;
    stateAddressState?: string;
    stateAddressZip?: string;
    entityType?: string;
    entitySubType?: string;
    phoneNumber?: string;
    email?: string;
    agentIsCommercial?: boolean;
    url?: string;
    industry?: string;
    sosId?: string;
    confidenceLevel?: number;
    /**
     * Will be ISO string format. IE: '2022-08-31T22:46:14.359Z'
     */
    normalizedFilingDate?: string;
    /**
     * Will be 'active' or 'inactive'.
     */
    normalizedStatus?: string;
    /**
     * Used to relay anything unexpected that may have occurred during the process.
     */
    messages?: string[];
    /**
     * Used by Texas
     */
    taxPayerNumber?: string;
    officers?: IOfficer[];
    documents?: IDocument[];
    uccData?: IUCCData[];
    screenshotUrl?: string;
    alternativeResults?: any[];
    EIN?: string;
    personNameMatch?: string;
    inactiveDate?: string;
}

export enum Status {
	'Incomplete' = 'Incomplete',
	'Complete' = 'Complete',
	'Failed' = 'Failed',
	'Retry Id invalid' = 'Retry Id invalid',
	'Bad request' = 'Bad request'
}

export interface IResponseBody {
	status: Status;
	retryId?: string;
	statusCode?: number;
	message?: string;
	results?: IBusiness[];
	alternativeResults?: any[];
}

export interface IOfficer {
    name: string;
    title?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    email?: string;
    current?: string;
}

export interface IDocument {
    name: string;
    url: string;
    date?: string;
}

export interface IUCCData {
    fileNumber: string;
    debtors: IDebtor[];
    securedParties: ISecuredParty[];
    type: string;
    filingDate: string;
    status?: string;
    lapseDate?: string;
    imageUrl?: string;
}

export interface IDebtor {
    name: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
}

export interface ISecuredParty {
    name: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
}

export interface IDebtor {
    name: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
}

/**
 * This is the data structure used in delinquent-property-tax in Dynamodb
 */
export interface IParcel {
    parcelNumber?: string;
    legalDescription?: string;
    propertyStreet?: string;
    propertyCity?: string;
    propertyState?: string;    
    propertyZip?: string;
    ownerName1FirstName?: string;
    ownerName1LastName?: string;
    ownerName2FirstName?: string;
    ownerName2LastName?: string;
    /**
     * Useful if current owner is a trust or estate
     */
    previousOwnerFirstName?: string;
    /**
     * Useful if current owner is a trust or estate
     */
    previousOwnerLastName?: string;
    ownerStreet?: string;
    ownerCity?: string;
    ownerState?: string;
    ownerZip?: string;
    delinquencyDate?: string;
    amountDue2020?: number;
    amountDue2019?: number;
    amountDue2018?: number;
    amountDue2017?: number;
    amountDue2016?: number;
    totalDue?: number;
    assessorUrl?: string;
    presentUse?: PropertyUses;
	county?: string;
	state?: string;
    landSqFoot?: string;
    appraisedValue?: number;
}

export interface IAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export enum PropertyUses {
    'SFR' = 'SFR',
    'MFR' = 'MFR',
    'Vacant' = 'Vacant',
    'Commercial' = 'Commercial'
}

export enum States {
    'AL' = 'AL', 
    'AK' = 'AK', 
    'AZ' = 'AZ', 
    'AR' = 'AR', 
    'CA' = 'CA', 
    'CO' = 'CO', 
    'CT' = 'CT', 
    'DC' = 'DC',
    'DE' = 'DE', 
    'FL' = 'FL', 
    'GA' = 'GA',
    'HI' = 'HI', 
    'ID' = 'ID', 
    'IL' = 'IL', 
    'IN' = 'IN', 
    'IA' = 'IA', 
    'KS' = 'KS', 
    'KY' = 'KY', 
    'LA' = 'LA', 
    'ME' = 'ME', 
    'MD' = 'MD', 
    'MA' = 'MA',
    'MI' = 'MI', 
    'MN' = 'MN', 
    'MS' = 'MS', 
    'MO' = 'MO', 
    'MT' = 'MT', 
    'NE' = 'NE', 
    'NV' = 'NV', 
    'NH' = 'NH', 
    'NJ' = 'NJ', 
    'NM' = 'NM', 
    'NY' = 'NY', 
    'NC' = 'NC', 
    'ND' = 'ND',
    'OH' = 'OH', 
    'OK' = 'OK', 
    'OR' = 'OR', 
    'PA' = 'PA', 
    'RI' = 'RI', 
    'SC' = 'SC', 
    'SD' = 'SD', 
    'TN' = 'TN', 
    'TX' = 'TX', 
    'UT' = 'UT',
    'VT' = 'VT', 
    'VA' = 'VA', 
    'WA' = 'WA', 
    'WV' = 'WV', 
    'WI' = 'WI', 
    'WY' = 'WY'
};