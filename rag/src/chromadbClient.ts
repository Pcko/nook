import dotenv from "dotenv";
import type {ChromaDBQueryResponseBody} from './dto/chromadbQueryResponseBody.dto.js';
import { ChromaClient } from "chromadb";
import { OllamaEmbeddingFunction } from '@chroma-core/ollama';
import type {ChromaDBGetResponseBody} from "./dto/chromaDBGetResponseBody.dto.js";

dotenv.config();
const defaultNResults = parseInt(process.env.CHROMADB_N_RESULTS || "5");

const embedder = new OllamaEmbeddingFunction({
    url: 'http://localhost:11434',
    model: 'nomic-embed-text',
});

const client = new ChromaClient({
    host: "localhost",
    port: parseInt(process.env.CHROMADB_API_PORT || "8000"),
    ssl: false
});

const collection = await client.getOrCreateCollection({
    name: "nook-page-generation",
    embeddingFunction: embedder
});

async function getChromaDBQueryResponse(query: string, nResults: number=defaultNResults): Promise<ChromaDBQueryResponseBody> {
    const queryResult = await collection.query({
        queryTexts: [query],
        nResults: nResults,
    });

    return {
        documents: queryResult.documents,
    };
}

async function getChromaDBEntries(): Promise<ChromaDBGetResponseBody> {
    const getResult = await collection.get();

    return {
        ids: getResult.ids,
        documents: getResult.documents,
        metadatas: getResult.metadatas
    };
}

async function removeChromaDBEntries(ids: string[]): Promise<void> {
    await collection.delete({ids});
}

async function addChromaDBDocuments(ids: string[], documents: string[]) {
    await collection.add({
       ids,
       documents: documents,
    });
}

export default {
    query: getChromaDBQueryResponse,
    addDocuments: addChromaDBDocuments,
    getEntries: getChromaDBEntries,
    removeEntries: removeChromaDBEntries,
};
