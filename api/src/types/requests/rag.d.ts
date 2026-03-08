export interface RAGQueryBody {
    pageName: string;
    query: string;
    provider: string;
    skipContext?: boolean;
    stream?: boolean;
}

export interface RAGResponseBody {
    think: string;
    response: string;
    total_duration: number;
}

/**
 * @interface RAGElementEditRequestBody
 *
 * @param {string} pageName - The name of the page edit.
 * @param {ChatCompletionMessageParam[]} messages - Message history from the user/assistant.
 * @param {string} elementId - The ID of the element to be edited.
 * @param {string} websiteData - The website data to include in the prompt.
 */
export interface RAGElementEditRequestBody {
    pageName: string;
    messages: UserChatCompletionMessageParam[];
    elementId: string;
    websiteData: string;
}

/**
 * @interface RAGElementEditResponseBody
 *
 * @param {string} think - Reasoning of reasoning LLMs. (only qwen3 or gpt currently support this)
 * @param {string} component - The element data that was edited.
 * @param {Array<Object>} styles - The website styles data that was edited.
 * @param {number} total_duration - The time elapsed during the LLM request.
 */
export interface RAGElementEditResponseBody {
    think: string;
    text: string;
    component: string;
    styles: Array<Object>;
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

/**
 * Represents the page to be semantically indexed.
 *
 * @interface PageIndexRequestBody
 * @property {string} pageName - The name of the user's page
 */
export interface PageIndexRequestBody {
    pageName: string;
    pageContent: string;
}