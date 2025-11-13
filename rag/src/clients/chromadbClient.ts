import { ChromaClient } from "chromadb";
import { OllamaEmbeddingFunction } from '@chroma-core/ollama';

import type {
    ChromaDBAddDocumentsRequestBody,
    ChromaDBGetResponseBody, ChromaDBQuery,
    ChromaDBQueryResultItem
} from "../dto/chroma.js";

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

/**
 * Performs a similarity search using Chroma.
 *
 * @async
 * @function getChromaDBQueryResponse
 * @param {ChromaDBQuery} request - The request for Chroma.
 * @returns {Promise<ChromaDBQueryResultItem[]>} A promise that resolves
 * to an array of similar documents, sorted by their distances from Chroma.
 */
async function getChromaDBQueryResponse(request: ChromaDBQuery): Promise<ChromaDBQueryResultItem[]> {
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

/**
 * Retrieves all entries from the current ChromaDB collection.
 *
 * @async
 * @function getChromaDBEntries
 * @returns {Promise<ChromaDBGetResponseBody>} A promise that resolves to the Chroma Entries.
 */
async function getChromaDBEntries(): Promise<ChromaDBGetResponseBody> {
    const getResult = await collection.get();

    return {
        ids: getResult.ids,
        documents: getResult.documents,
        metadatas: getResult.metadatas
    };
}

/**
 * Removes one or more entries from the current ChromaDB collection.
 *
 * @async
 * @function removeChromaDBEntries
 * @param {string[]} ids - An array of document IDs to delete from the collection.
 * If an id from this list does not exist in Chroma, it is skipped.
 * @returns {Promise<void>} A Promise that resolves when the specified entries have been removed.
 */
async function removeChromaDBEntries(ids: string[]): Promise<void> {
    await collection.delete({ids});
}

/**
 * Adds new documents and their associated metadata to the current ChromaDB collection.
 *
 * @async
 * @function addChromaDBDocuments
 * @param {ChromaDBAddDocumentsRequestBody} chromaAddDocumentsBody - The documents, metadata, and IDs to add.
 * @returns {Promise<void>} Resolves when the documents have been successfully added to the collection.
 */
async function addChromaDBDocuments(chromaAddDocumentsBody: ChromaDBAddDocumentsRequestBody): Promise<void> {
    await collection.add(chromaAddDocumentsBody);
}

export default {
    query: getChromaDBQueryResponse,
    addDocuments: addChromaDBDocuments,
    getEntries: getChromaDBEntries,
    removeEntries: removeChromaDBEntries,
};
