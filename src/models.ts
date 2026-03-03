/**
 * This is the format of data returned from sos-search
 */
export interface IBusiness {
    /** The name of the business */
    title?: string;
    /** The date the business was filed/registered with the Secretary of State */
    filingDate?: string;
    /** The state where the business was originally formed/incorporated */
    stateOfFormation?: States;
    /** The state where this SOS registration was filed */
    stateOfSosRegistration?: States;
    /** The business's status as reported by the SOS (e.g., "Active", "Inactive", "Dissolved") */
    status?: string;
    /** The registered agent's name */
    agentName?: string;
    /** The registered agent's city */
    agentCity?: string;
    /** The registered agent's state */
    agentState?: States;
    /** The registered agent's zip code */
    agentZip?: string;
    /** The registered agent's street address */
    agentStreetAddress?: string;
    /** The business's physical street address */
    physicalAddressStreet?: string;
    /** The business's physical address city */
    physicalAddressCity?: string;
    /** The business's physical address state */
    physicalAddressState?: string;
    /** The business's physical address zip code */
    physicalAddressZip?: string;
    /** The business's mailing street address */
    mailingAddressStreet?: string;
    /** The business's mailing address city */
    mailingAddressCity?: string;
    /** The business's mailing address state */
    mailingAddressState?: string;
    /** The business's mailing address zip code */
    mailingAddressZip?: string;
    /** The business's in-state physical street address */
    stateAddressStreet?: string;
    /** The business's in-state physical address city */
    stateAddressCity?: string;
    /** The business's in-state physical address state */
    stateAddressState?: string;
    /** The business's in-state physical address zip code */
    stateAddressZip?: string;
    /** The type of business entity (e.g., "LLC", "Corporation", "Partnership") */
    entityType?: string;
    /** More specific entity classification (e.g., "Domestic", "Foreign", "Nonprofit") */
    entitySubType?: string;
    /** The business's phone number */
    phoneNumber?: string;
    /** The business's email address */
    email?: string;
    /** Whether the registered agent is a commercial agent service */
    agentIsCommercial?: boolean;
    /** The URL on the Secretary of State website for this business record */
    url?: string;
    /** The business's industry classification */
    industry?: string;
    /** The ID/filing number assigned by the Secretary of State */
    sosId?: string;
    /** Algorithmic confidence score using Levenshtein distance to compare the search query to the found business name */
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
    /** Officers, directors, or members of the business */
    officers?: IOfficer[];
    /** Documents on file with the SOS (articles, amendments, annual reports, etc.) */
    documents?: IDocument[];
    /** Uniform Commercial Code filing data associated with this business */
    uccData?: IUCCData[];
    /** URL to a screenshot of the SOS page */
    screenshotUrl?: string;
    /** Other possible business matches from the search results */
    alternativeResults?: any[];
    /** History of changes/amendments to the business filing */
    history?: IHistory[];
    /** Employer Identification Number (federal tax ID) */
    EIN?: string;
    /** The person name from the search query that matched an officer or agent */
    personNameMatch?: string;
    /**May be date or something like 'Perpetual' */
    inactiveDate?: string;
    /** Beta AI-based confidence score that attempts human-like matching to determine result accuracy */
    aiConfidenceLevel?: number;
    /** Whether the registered agent has resigned */
    agentResigned?: boolean;
    /** Date the registered agent resigned */
    agentResignedDate?: string;
    /**
     * New York also uses a service of process agent
     */
    sopName?: string;
    /** Service of process agent's city */
    sopCity?: string;
    /** Service of process agent's state */
    sopState?: States;
    /** Service of process agent's zip code */
    sopZip?: string;
    /** Service of process agent's street address */
    sopStreetAddress?: string;
    /** DBAs (Doing Business As) or assumed names for this business */
    assumedBusinessNames?: IAssumedBusinessName[];
    /** Whether the business address matched the address provided in the search query */
    addressMatch?: boolean;
    /**
     * This will only show up when the name listed on the search results differs from the name within the details.
     * This can happen when the name on the search results is a DBA the and details page lists the legal name.
     */
    searchResultTitle?: string;
    /** Date the next annual report is due */
    nextReportDueDate?: string;
    /**
     * This is WA specific
     */
    ubiNumber?: string;
    /** Annual report filing standing */
    arStanding?: string;
    /**
     * Currently only MD
     */
    goodStanding?: string;
    /** Counts of officers, documents, UCC data, assumed names, and history entries */
    fullDataCount?: IFullDataCount;
}
export interface IAssumedBusinessName {
    /** The assumed business name / DBA name */
    title: string;
    /** Date the assumed name became effective */
    effectiveDate?: string;
    /** Status of the assumed name (e.g., "Active", "Expired") */
    status?: string;
    /** Type of assumed name filing */
    type?: string;
    /** Date the assumed name expires */
    expirationDate?: string;
    /** The SOS ID for this assumed name filing */
    sosId?: string;
    /** Whether this is a joint venture */
    jointVenture?: boolean;
}
export declare enum Status {
    'Incomplete' = "Incomplete",
    'Complete' = "Complete",
    'Failed' = "Failed",
    'Retry Id invalid' = "Retry Id invalid",
    'Bad request' = "Bad request"
}
export interface IResponseBody {
    /** The status of the API request */
    status: Status;
    /** ID to retry an incomplete request */
    retryId?: string;
    /** HTTP status code */
    statusCode?: number;
    /** Additional message about the response */
    message?: string;
    /** The business results found */
    results?: IBusiness[];
    /** Other possible business matches */
    alternativeResults?: any[];
    /** Webhook callback information for async requests */
    callbackData?: ICallbackData;
}
export interface IOfficer {
    /** The officer's full name */
    name: string;
    /** The officer's role/title (e.g., "President", "Director", "Member") */
    title?: string;
    /** The officer's street address */
    streetAddress?: string;
    /** The officer's city */
    city?: string;
    /** The officer's state */
    state?: string;
    /** The officer's zip code */
    zip?: string;
    /** The officer's phone number */
    phone?: string;
    /** The officer's email address */
    email?: string;
    /** Whether the officer is currently active */
    current?: string;
}
export interface IDocument {
    /** The document name/title */
    name: string;
    /** URL to view/download the document from the SOS */
    url: string;
    /** Date the document was filed */
    date?: string;
    /** Additional notes or description of the document */
    comment?: string;
    /** Cobalt Intelligence's cached URL for the document */
    cobaltUrl?: string;
}

export interface IUCCData {
    /** The UCC filing number */
    fileNumber: string;
    /** Debtors listed on the UCC filing */
    debtors: IDebtor[];
    /** Secured parties (lenders) on the UCC filing */
    securedParties: ISecuredParty[];
    /** Type of UCC filing (e.g., "Original", "Amendment", "Continuation") */
    type: string;
    /** Date the UCC was filed */
    filingDate: string;
    /** Status of the UCC filing */
    status?: string;
    /** Date the UCC filing lapses/expires */
    lapseDate?: string;
    /** URL to the UCC filing image/document */
    imageUrl?: string;
}
export interface IDebtor {
    /** The debtor's name */
    name: string;
    /** The debtor's street address */
    street?: string;
    /** The debtor's city */
    city?: string;
    /** The debtor's state */
    state?: string;
    /** The debtor's zip code */
    zip?: string;
}
export interface ISecuredParty {
    /** The secured party's name */
    name: string;
    /** The secured party's street address */
    street?: string;
    /** The secured party's city */
    city?: string;
    /** The secured party's state */
    state?: string;
    /** The secured party's zip code */
    zip?: string;
}
export interface IDebtor {
    /** The debtor's name */
    name: string;
    /** The debtor's street address */
    street?: string;
    /** The debtor's city */
    city?: string;
    /** The debtor's state */
    state?: string;
    /** The debtor's zip code */
    zip?: string;
}

export interface IAddress {
    /** Street address */
    street: string;
    /** City */
    city: string;
    /** State */
    state: string;
    /** Zip code */
    zip: string;
}
export interface IHistory {
    /** Name/type of the historical event (e.g., "Annual Report", "Amendment") */
    name: string;
    /** Date of the event */
    date: string;
    /** List of specific changes made in this event */
    changes: IChange[];
}

export interface IChange {
    /** Name/description of what changed */
    name: string;
    /** Previous value before the change */
    changedFrom?: string;
    /** New value after the change */
    changedTo?: string;
    /** Type of action (e.g., "Added", "Removed", "Modified") */
    action?: string;
    /** Title/role related to the change (e.g., officer title) */
    title?: string;
}

export interface ICallbackData {
    /** Unique identifier for the async request */
    requestId: string;
    /** URL to receive the webhook callback */
    callbackUrl: string;
}

export interface IFullDataCount {
    /** Number of officers/directors/members */
    officersCount: number;
    /** Number of documents on file */
    documentsCount: number;
    /** Number of UCC filings */
    uccDataCount: number;
    /** Number of assumed business names / DBAs */
    assumedBusinessNamesCount: number;
    /** Number of history entries */
    historyCount: number;
}

export enum States {
    'AL' = "AL",
    'AK' = "AK",
    'AZ' = "AZ",
    'AR' = "AR",
    'CA' = "CA",
    'CO' = "CO",
    'CT' = "CT",
    'DC' = "DC",
    'DE' = "DE",
    'FL' = "FL",
    'GA' = "GA",
    'HI' = "HI",
    'ID' = "ID",
    'IL' = "IL",
    'IN' = "IN",
    'IA' = "IA",
    'KS' = "KS",
    'KY' = "KY",
    'LA' = "LA",
    'ME' = "ME",
    'MD' = "MD",
    'MA' = "MA",
    'MI' = "MI",
    'MN' = "MN",
    'MS' = "MS",
    'MO' = "MO",
    'MT' = "MT",
    'NE' = "NE",
    'NV' = "NV",
    'NH' = "NH",
    'NJ' = "NJ",
    'NM' = "NM",
    'NY' = "NY",
    'NC' = "NC",
    'ND' = "ND",
    'OH' = "OH",
    'OK' = "OK",
    'OR' = "OR",
    'PA' = "PA",
    'RI' = "RI",
    'SC' = "SC",
    'SD' = "SD",
    'TN' = "TN",
    'TX' = "TX",
    'UT' = "UT",
    'VT' = "VT",
    'VA' = "VA",
    'WA' = "WA",
    'WV' = "WV",
    'WI' = "WI",
    'WY' = "WY"
}
