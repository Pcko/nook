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

/**
 *
 * @interface ElementEditRequestBody
 * @param {string} think - Reasoning of reasoning LLMs. (only qwen3 or gpt currently support this)
 * @param {string} component - The element data that was edited.
 * @param {string} styles - The website styles data that was edited.
 * @param {number} total_duration - The time elapsed during the LLM request.
 */
export interface RAGElementEditResponseBody {
    think: string;
    component: string;
    styles: string;
    total_duration: number;
}

/**
 * Represents a single message in a chat completion request.
 *
 * @interface ChatCompletionMessageParam
 * @property {"system" | "user" | "assistant"} role - The role of the message sender.
 * system: An instruction for the LLM that is not user-entered.
 * user: The message a user has entered.
 * assistant: The response to a chat completion request.
 * @property {string} content - The text content of the message.
 */
export interface ChatCompletionMessageParam {
    role: "system" | "user" | "assistant";
    content: string;
}

/**
 * Represents a single message in a chat completion request sent by the user.
 *
 * @interface ChatCompletionMessageParam
 * @property {"user" | "assistant"} role - The role of the message sender.
 * user: The message a user has entered.
 * assistant: The response to a chat completion request.
 */
export interface UserChatCompletionMessageParam extends ChatCompletionMessageParam {
    role: "user" | "assistant";
}