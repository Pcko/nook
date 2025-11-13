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
export default interface ChatCompletionMessageParam {
    role: "system" | "user" | "assistant";
    content: string;
}