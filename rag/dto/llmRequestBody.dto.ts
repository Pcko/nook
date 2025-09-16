export interface LlmRequestBody {
    model: string,
    prompt: string;
    stream: boolean;
}