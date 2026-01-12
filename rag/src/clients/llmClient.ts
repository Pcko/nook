import type ChatCompletionMessageParam from "../types/ChatCompletionMessageParam.js";
import type {QueryResponseBody} from "../dto/rag.js";
import type {StreamCallback} from "../types/StreamCallback.js";

/*
    Abstract LLM Client


*/
export default abstract class LlmClient {

    /**
     * Sends a chat completion request for an LLM.
     *
     * @function getResponse
     * @param {ChatCompletionMessageParam[]} messages - The messages for the LLM chat completion.
     * @returns {Promise<QueryResponseBody>} A Promise that resolves to the LLM response.
     */
    abstract getResponse(messages: ChatCompletionMessageParam[]): Promise<QueryResponseBody>;

    /**
     * A streamed chat completion request for an LLM.
     *
     * @function streamResponse
     * @param {ChatCompletionMessageParam[]} messages - The messages for the LLM (history + new user prompt).
     * @param {StreamCallback} onData - A callback to handle the streaming response.
     * @returns {Promise<void>} A Promise that resolves when the stream is completed.
     */
    abstract streamResponse(messages: ChatCompletionMessageParam[], onData: StreamCallback): Promise<void>;
}