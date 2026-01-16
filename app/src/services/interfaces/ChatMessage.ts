import {PageMeta} from "./PageMeta.ts";

/**
 * Represents a single message in a chat completion request.
 *
 * @interface ChatMessage
 * @property { "user" | "assistant"} role - The role of the message sender.
 * user: The message a user has entered.
 * assistant: The response to a chat completion request.
 * @property {string} content - The text content of the message.
 */
export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

/**
 * Represents the whole chat.
 *
 * @interface ChatObject
 * @property {string} elementId - The id of the element that the assistant should edit
 * @property {string} websiteData - The whole state of the page a stringified ProjectData object
 */
export interface ChatObject {
    /** Page name for metadata extraction on the backend. */
    pageName: string;
    elementId: string;
    websiteData: string;
    messages: ChatMessage[];
}