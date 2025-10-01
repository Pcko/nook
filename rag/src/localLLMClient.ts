import type {LlmResponseBody} from "./dto/llmResponseBody.dto.js";

export async function getLLMResponse(query: string): Promise<LlmResponseBody> {
    try {
        const port = process.env.LLM_API_PORT || '11434';
        const response = await fetch(`http://localhost:${port}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.Local_LLM_Model,
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
