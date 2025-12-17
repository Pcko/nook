import Groq from 'groq-sdk';

import {type StreamCallback} from '../types/StreamCallback.js';
import type {QueryResponseBody} from "../dto/rag.js";
import type ChatCompletionMessageParam from "../types/ChatCompletionMessageParam.js";
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * A streamed chat completion request for a Groq LLM.
 *
 * @function streamGroqResponse
 * @param {ChatCompletionMessageParam[]} messages - The messages for the LLM (history + new user prompt).
 * @param {StreamCallback} onData - A callback to handle the streaming response.
 * @returns {Promise<void>} A Promise that resolves when the stream is completed.
 */
async function streamGroqResponse(messages: ChatCompletionMessageParam[], onData: StreamCallback): Promise<void> {
    try {
        const stream = await groq.chat.completions.create({
            messages: messages,
            model: process.env.GROQ_LLM_MODEL || 'qwen/qwen3-32b',
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                onData(content);
            }
        }
    } catch (err) {
        console.error('Streaming error from Groq:', err);
        throw err;
    }
}

/**
 * Sends a chat completion request for a Groq LLM.
 *
 * @function getGroqResponse
 * @param {ChatCompletionMessageParam[]} messages - The messages for the LLM (history + new user prompt).
 * @returns {Promise<QueryResponseBody>} A Promise that resolves to the LLM response.
 */
async function getGroqResponse(messages: ChatCompletionMessageParam[]): Promise<QueryResponseBody> {
    try{
        const startingTime = process.hrtime();
        const response = await groq.chat.completions.create({
            messages: messages,
            model: process.env.GROQ_LLM_MODEL || 'qwen/qwen3-32b',
            stream: false,
        });

        const data = response.choices[0]?.message?.content || '';

        const duration = process.hrtime(startingTime);

        const thinkMatch = data.match(/<think>(.*?)<\/think>/s);
        const think = (thinkMatch ? thinkMatch[1]?.trim() : '') || '';
        const trimmedResponse = data.replace(/<think>.*?<\/think>/s, '').trim();

        return {
            think: think,
            response: trimmedResponse,
            total_duration: duration[0]*1e9 + duration[1]
        }
    } catch (err) {
        console.error('Response Error from Groq: ', err);
        throw err;
    }
}

export default {
    streamGroqResponse,
    getGroqResponse
};
