export interface RAGQueryBody {
    query: string;
    skipContext?: boolean;
    useLocalLLM?: boolean;
    stream?: boolean;
}

export interface RAGResponseBody {
    think: string;
    response: string;
    total_duration: number;
}