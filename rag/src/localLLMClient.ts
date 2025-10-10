import type {QueryResponseBody} from "./dto/queryResponseBody.dto.js";
import {type StreamCallback} from './types/StreamCallback.js';

function getPort() {
    return process.env.LLM_API_PORT || '11434';
}

async function getLLMResponse(query: string): Promise<QueryResponseBody> {
    try {
        const response = await fetch(`http://localhost:${getPort()}/api/generate`, {
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

async function streamLLMResponse(query: string, onData: StreamCallback) {
    try {
        const response = await fetch(`http://localhost:${getPort()}/api/generate`, {
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

        if(!response.body){
            throw new Error("Ollama did not respond with a stream");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break
            }

            const chunk = JSON.parse(decoder.decode(value, { stream: true }));

            onData(chunk.response);
        }
    } catch (err) {
        console.error('Streaming error from Groq:', err);
        throw err;
    }
}

export default {
    streamLLMResponse,
    getLLMResponse
}
