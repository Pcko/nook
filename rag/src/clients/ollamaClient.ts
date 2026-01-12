import {type StreamCallback} from '../types/StreamCallback.js';
import type {QueryResponseBody} from "../dto/rag.js";
import LlmClient from "./llmClient.js";
import type ChatCompletionMessageParam from "../types/ChatCompletionMessageParam.js";

const port = process.env.LLM_API_PORT || '11434';

export default class OllamaClient extends LlmClient {

    private readonly apiRoute = `http://localhost:${port}/v1/chat/completions`;

    /**
     * Sends a chat completion request for a local LLM (served by ollama).
     *
     * @function getResponse
     * @param {ChatCompletionMessageParam[]} messages - The messages for the LLM chat completion.
     * @returns {Promise<QueryResponseBody>} A Promise that resolves to the LLM response.
     */
    async getResponse(messages: ChatCompletionMessageParam[]): Promise<QueryResponseBody> {
        try {
            const response = await fetch(this.apiRoute, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: process.env.LOCAL_LLM_MODEL,
                    stream: false,
                    messages: messages,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`LLM API error: ${errorText}`);
            }

            const json = await response.json();
            const choices: [] = json.choices;

            // @ts-ignore
            const data = json.choices[0].message.content;
            const thinkMatch = data.match(/<think>(.*?)<\/think>/s);
            const think = thinkMatch ? thinkMatch[1].trim() : "";
            const trimmedResponse = data.replace(/<think>.*?<\/think>/s, '').trim();

            return {
                think,
                response: trimmedResponse,
                total_duration: data.total_duration
            };
        } catch (err) {
            console.error('Error fetching AI response:', err);
            throw err;
        }
    }

    /**
     * A streamed chat completion request for a local LLM (served by ollama).
     *
     * @function streamResponse
     * @param {ChatCompletionMessageParam[]} messages - The prompt for the LLM.
     * @param {StreamCallback} onData - A callback to handle the streaming response.
     * @returns {Promise<void>} A Promise that resolves when the stream is completed.
     */
    async streamResponse(messages: ChatCompletionMessageParam[], onData: StreamCallback): Promise<void> {
        try {
            const response = await fetch(this.apiRoute, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: process.env.LOCAL_LLM_MODEL,
                    stream: true,
                    messages: messages,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ollama API error: ${errorText}`);
            }

            if (!response.body) {
                throw new Error("Ollama did not respond with a stream");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const {value, done} = await reader.read();
                if (done) {
                    break;
                }

                const chunk = JSON.parse(decoder.decode(value, {stream: true}));

                onData(chunk.response);
            }
        } catch (err) {
            console.error('Streaming error from Ollama:', err);
            throw err;
        }
    }
}
