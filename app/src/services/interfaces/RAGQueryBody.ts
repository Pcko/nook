export interface RAGQueryBody {
    query: string;
    skipContext?: boolean;
    useLocalLLM?: boolean;
    stream?: boolean;
}

export interface RAGResponseDTO {
    think: string;
    response: string;
    total_duration: number;
}