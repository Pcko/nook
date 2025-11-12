import type ChatCompletionMessageParam from "../types/ChatCompletionMessageParam.js";

export interface QueryRequestBody {
    query: string;
    useLocalLLM?: boolean;
    skipContext?: boolean;
    stream?: boolean;
}

export interface QueryResponseBody {
    think: string;
    response: string;
    total_duration: number;
}

export interface ElementEditRequestBody {
    messages: ChatCompletionMessageParam[];
    elementId: string;
    websiteData: string;
}

export interface ElementEditResponseBody {
    think: string;
    component: string;
    styles: string;
    total_duration: number;
}