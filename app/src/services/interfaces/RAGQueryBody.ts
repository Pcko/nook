export interface RAGQueryBody {
    query: string;
    skipContext?: boolean;
    useLocalLLM?: boolean;
    stream?: boolean;
}