import { abbreviateState } from '.';
import { IUccResponseBody, IUccResult, Status } from './models';

/** Messages a UCC search can carry back to the caller */
export const UCC_RESULT_FOUND = 'UCC data found.';
export const UCC_RESULT_NONE = 'No UCC data found.';
export const UCC_RESULT_ERROR = 'Error happened while searching for UCC data. You have not been charged.';

/**
 * Shapes the customer-facing body of a UCC-only request from the outcome of the search.
 *
 * @param result What the search produced; state may be a full name or abbreviation
 */
export function createUccResponseBody(result: IUccResult): IUccResponseBody {
    const base = { searchQuery: result.searchQuery, state: result.state ? abbreviateState(result.state) : undefined };
    if (!result.succeeded) {
        return { status: Status.Failed, statusCode: 500, message: result.message || UCC_RESULT_ERROR, ...base };
    }
    const uccData = result.uccData ?? [];
    return {
        status: Status.Complete,
        statusCode: 200,
        ...base,
        uccData,
        uccDataCount: result.uccDataCount ?? uccData.length,
        ...(uccData.length ? {} : { message: UCC_RESULT_NONE })
    };
}
