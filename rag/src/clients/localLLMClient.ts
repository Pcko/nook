import {type StreamCallback} from '../types/StreamCallback.js';
import type {QueryResponseBody} from "../dto/rag.js";

const port = process.env.LLM_API_PORT || '11434';

/**
 * Sends a chat completion request for a local LLM (served by ollama).
 *
 * @function getLLMResponse
 * @param {string} query - The prompt for the LLM.
 * @returns {Promise<QueryResponseBody>} A Promise that resolves to the LLM response.
 */
async function getLLMResponse(query: string): Promise<QueryResponseBody> {
    try {
        const response = await fetch(`http://localhost:${port}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.LOCAL_LLM_MODEL,
                prompt: query,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LLM API error: ${errorText}`);
        }

        const data = await response.json();
        const thinkMatch = data.response.match(/<think>(.*?)<\/think>/s);
        const think = thinkMatch ? thinkMatch[1].trim() : "";
        const trimmedResponse = data.response.replace(/<think>.*?<\/think>/s, '').trim();

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
 * @function streamLLMResponse
 * @param {string} query - The prompt for the LLM.
 * @param {StreamCallback} onData - A callback to handle the streaming response.
 * @returns {Promise<void>} A Promise that resolves when the stream is completed.
 */
async function streamLLMResponse(query: string, onData: StreamCallback): Promise<void> {
    try {
        const response = await fetch(`http://localhost:${port}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.LOCAL_LLM_MODEL,
                prompt: query,
                stream: true,
            }),
        });

        if(!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama API error: ${errorText}`);
        }

        if(!response.body){
            throw new Error("Ollama did not respond with a stream");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }

            const chunk = JSON.parse(decoder.decode(value, { stream: true }));

            onData(chunk.response);
        }
    } catch (err) {
        console.error('Streaming error from Ollama:', err);
        throw err;
    }
}

export default {
    streamLLMResponse,
    getLLMResponse
}
