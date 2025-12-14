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
 * @interface RAGElementEditRequestBody
 * @param {ChatCompletionMessageParam[]} messages - Message history from the user/assistant.
 * @param {string} elementId - The ID of the element to be edited.
 * @param {string} websiteData - The website data to include in the prompt.
 */
export interface RAGElementEditRequestBody {
    messages: UserChatCompletionMessageParam[];
    elementId: string;
    websiteData: string;
}

/**
 *
 * @interface RAGElementEditResponseBody
 * @param {string} think - Reasoning of reasoning LLMs. (only qwen3 or gpt currently support this)
 * @param {Object} component - The element data that was edited.
 * @param {Object} styles - The website styles data that was edited.
 * @param {number} total_duration - The time elapsed during the LLM request.
 */
export interface RAGElementEditResponseBody {
    think: string;
    text: string;
    component: Object;
    styles: Object;
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
 * @interface UserChatCompletionMessageParam
 * @property {"user" | "assistant"} role - The role of the message sender.
 * user: The message a user has entered.
 * assistant: The response to a chat completion request.
 */
export interface UserChatCompletionMessageParam extends ChatCompletionMessageParam {
    role: "user" | "assistant";
}