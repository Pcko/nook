import Groq from 'groq-sdk';
import {type StreamCallback} from '../types/StreamCallback.js';
import type {ElementEditRequestBody, ElementEditResponseBody, QueryResponseBody} from "../dto/rag.js";
import type ChatCompletionMessageParam from "../types/ChatCompletionMessageParam.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function streamGroqResponse(query: string, onData: StreamCallback) {
    try {
        const stream = await groq.chat.completions.create({
            messages: [{ role: 'user', content: query }],
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

async function getGroqResponse(query: string): Promise<QueryResponseBody> {
    try{
        const startingTime = process.hrtime();
        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: query }],
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
            total_duration: duration[1]
        }
    } catch (err) {
        console.error('Response Error from Groq: ', err);
        throw err;
    }
}

async function getElementEditResponse(messages: ChatCompletionMessageParam[]) : Promise<ElementEditResponseBody> {
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

        const parts: { styles: string, component: string } = JSON.parse(trimmedResponse);

        return {
            think: think,
            styles: parts.styles,
            component: parts.component,
            total_duration: duration[1]
        }
    } catch (err) {
        console.error('Response Error from Groq: ', err);
        throw err;
    }
}

export default {
    streamGroqResponse,
    getGroqResponse,
    getElementEditResponse,
};
