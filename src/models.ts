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
    /**
     * @deprecated This will be removed.
     */
    physicalAddress?: string;
    physicalAddressStreet?: string;
    physicalAddressCity?: string;
    physicalAddressState?: string;
    physicalAddressZip?: string;    
    /**
     * @deprecated This will be removed.
     */
    mailingAddress?: string;
    mailingAddressStreet?: string;
    mailingAddressCity?: string;
    mailingAddressState?: string;
    mailingAddressZip?: string;
    stateAddressStreet?: string;
    stateAddressCity?: string;
    stateAddressState?: string;
    stateAddressZip?: string;
    entityType?: string;
    phoneNumber?: string;
    email?: string;
    agentIsCommercial?: boolean;
    url?: string;
    industry?: string;
    sosId?: string;
    /**
     * Used by Texas
     */
    taxPayerNumber?: string;
};

/**
 * This is the data structure used in delinquent-property-tax in Dynamodb
 */
export interface IParcel {
    taxAccountNumber?: string;
    legalDescription?: string;
    propertyStreet?: string;
    propertyCity?: string;
    propertyState?: string;    
    propertyZip?: string;
    ownerName1FirstName?: string;
    ownerName1LastName?: string;
    ownerName2FirstName?: string;
    ownerName2LastName?: string;
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