export interface QueryRequestBody {
    query: string;
    useLocalLLM?: boolean;
    skipContext?: boolean;
    stream?: boolean;
}
