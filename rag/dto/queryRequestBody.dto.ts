export interface QueryRequestBody {
    query: string;
    forceGroq?: boolean;
    skipContext?: boolean;
}

export function isQueryRequestBody(obj: any): obj is QueryRequestBody {
    return obj && typeof obj.query === 'string' &&
        (obj.forceGroq === undefined || typeof obj.forceGroq === 'boolean') &&
        (obj.skipContext === undefined || typeof obj.skipContext === 'boolean');
}