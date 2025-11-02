import { ChromaClient } from "chromadb";
import { OllamaEmbeddingFunction } from '@chroma-core/ollama';
import type {
    ChromaDBAddDocumentsRequestBody,
    ChromaDBGetResponseBody, ChromaDBQuery,
    ChromaDBQueryResultItem
} from "./dto/chroma.js";

const defaultNResults = parseInt(process.env.CHROMADB_N_RESULTS || "15");
const defaultDistanceCutoff = Number(process.env.CHROMADB_QUERY_DISTANCE_CUTOFF || "0.5");

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

async function getChromaDBQueryResponse(request : ChromaDBQuery): Promise<ChromaDBQueryResultItem[]> {
    const queryResult = await collection.query({
        queryTexts: [request.query],
        nResults: request.nResults || defaultNResults,
        include: ["documents", "metadatas", "distances"],
        ...(request.where ? { where: request.where } : {})
    });

    const distances = queryResult.distances?.[0] || [];
    const documents = queryResult.documents?.[0] || [];
    const metadatas = queryResult.metadatas?.[0] || [];
    const ids = queryResult.ids?.[0] || [];

    const filtered = distances
        .map((dist, i) => ({
            distance: dist ?? 1,
            document: documents[i],
            metadata: metadatas[i],
            id: ids[i],
        }))
        .filter((item) => item.distance <= (request.distanceCutoff || defaultDistanceCutoff));

    return filtered;
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

async function addChromaDBDocuments(chromaAddDocumentsBody: ChromaDBAddDocumentsRequestBody): Promise<void> {
    await collection.add(chromaAddDocumentsBody);
}

export default {
    query: getChromaDBQueryResponse,
    addDocuments: addChromaDBDocuments,
    getEntries: getChromaDBEntries,
    removeEntries: removeChromaDBEntries,
};
