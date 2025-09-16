import dotenv from "dotenv";
import type {ChromadbResponseBody} from './dto/chromadbResponseBody.dto.ts';
dotenv.config();

export async function getChromaDBResponse(query: string, nResults: number): Promise<ChromadbResponseBody> {
    try {
        const port = process.env.CHROMADB_API_PORT || '8000';
        const response = await fetch(`http://localhost:${port}/api/v1/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                collection: 'nook_context',
                queryTexts: query,
                n_results: nResults,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ChromaDB API error: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching ChromaDB response:', err);
        throw err;
    }
}