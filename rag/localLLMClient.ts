import dotenv from "dotenv";
import type {LlmResponseBody} from "./dto/llmResponseBody.dto.ts";
dotenv.config();

export async function getLLMResponse(query: string, model: string = 'gpt-oss:20b'): Promise<LlmResponseBody> {
    try {
        const port = process.env.LLM_API_PORT || '11434';
        const response = await fetch(`http://localhost:${port}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                prompt: query,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LLM API error: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching AI response:', err);
        throw err;
    }
}