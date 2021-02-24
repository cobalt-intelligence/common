import { States } from './models';

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

export function abbreviateState(stateName: string) {

    const statesAndAbbreviations = [
        ['Arizona', States.AZ],
        ['Alabama', States.AL],
        ['Alaska', States.AK],
        ['Arkansas', States.AR],
        ['California', States.CA],
        ['Colorado', States.CO],
        ['Connecticut', States.CT],
        ['Delaware', States.DE],
        ['Florida', States.FL],
        ['Georgia', States.GA],
        ['Hawaii', States.HI],
        ['Idaho', States.ID],
        ['Illinois', States.IL],
        ['Indiana', States.IN],
        ['Iowa', States.IA],
        ['Kansas', States.KS],
        ['Kentucky', States.KY],
        ['Louisiana', States.LA],
        ['Maine', States.ME],
        ['Maryland', States.MD],
        ['Massachusetts', States.MA],
        ['Michigan', States.MI],
        ['Minnesota', States.MN],
        ['Mississippi', States.MS],
        ['Missouri', States.MO],
        ['Montana', States.MT],
        ['Nebraska', States.NE],
        ['Nevada', States.NV],
        ['New Hampshire', States.NH],
        ['New Jersey', States.NJ],
        ['New Mexico', States.NM],
        ['New York', States.NY],
        ['North Carolina', States.NC],
        ['North Dakota', States.ND],
        ['Ohio', States.OH],
        ['Oklahoma', States.OK],
        ['Oregon', States.OR],
        ['Pennsylvania', States.PA],
        ['Rhode Island', States.RI],
        ['South Carolina', States.SC],
        ['South Dakota', States.SD],
        ['Tennessee', States.TN],
        ['Texas', States.TX],
        ['Utah', States.UT],
        ['Vermont', States.VT],
        ['Virginia', States.VA],
        ['Washington', States.WA],
        ['West Virginia', States.WV],
        ['Wisconsin', States.WI],
        ['Wyoming', States.WY],
    ];

    stateName = stateName.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    for (let i = 0; i < statesAndAbbreviations.length; i++) {
        if (statesAndAbbreviations[i][0] === stateName) {
            return statesAndAbbreviations[i][1];
        }
    }
}