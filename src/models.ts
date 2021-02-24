export interface IBusiness {
    title: string;
    filingDate: string;
    state: States;
    status: string;
    agentName: string;
    agentCity: string;
    agentState: States;
    agentZip: string;
    physicalAddress?: string;
    mailingAddress?: string;
    entityType?: string;
    phoneNumber?: string;
    email?: string;
    agentIsCommercial?: boolean;
    url?: string;
    industry?: string;
};

export enum States {
    'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA',
    'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA',
    'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
    'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
    'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
};