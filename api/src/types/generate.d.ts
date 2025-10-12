export interface GenerationQueryBody {
    query: string;
    skipContext?: boolean;
    useLocalLLM?: boolean;
    stream?: boolean;
}

export interface GenerationResponseBody {
    think: string;
    response: string;
    total_duration: number;
}