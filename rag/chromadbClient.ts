import dotenv from "dotenv";
import type {ChromadbResponseBody} from './dto/chromadbResponseBody.dto.ts';
import {ChromaClient} from "chromadb";
import { OllamaEmbeddingFunction } from '@chroma-core/ollama';

dotenv.config();

const embedder = new OllamaEmbeddingFunction({
    url: 'http://localhost:11434',
    model: 'nomic-embed-text',
});

const client = new ChromaClient({
    host: "localhost",
    port: parseInt(process.env.CHROMADB_API_PORT || "8000"),
    ssl: false
});

const collection = await getChromaDBCollection("nook-page-generation");
console.log(collection);

export async function getChromaDBResponse(query: string, nResults: number): Promise<ChromadbResponseBody> {
    const queryResult = await collection.query({
        queryTexts: [query],
        nResults: nResults,
    });

    return {
        documents: queryResult.documents,
    };
}

export async function addChromaDBDocuments(ids: string[], documents: string[]) {
    await collection.add({
       ids,
       documents: documents,
    });
}

async function getChromaDBCollection(name: string) {
    try{
        return await client.getCollection({name});
    } catch (error) {
        return await client.createCollection({
            name: name,
            embeddingFunction: embedder
        });
    }
}
