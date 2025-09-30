export interface QueryRequestBody {
    query: string;
    useLocalLLM?: boolean;
    skipContext?: boolean;
}

export function isQueryRequestBody(obj: any): obj is QueryRequestBody {
    return obj && typeof obj.query === 'string' &&
        (obj.useLocalLLM === undefined || typeof obj.useLocalLLM === 'boolean') &&
        (obj.skipContext === undefined || typeof obj.skipContext === 'boolean');
}
