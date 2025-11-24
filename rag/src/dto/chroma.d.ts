import type {Metadata, Where} from "chromadb";

/**
 * Represents the request body used to add new documents to a ChromaDB collection.
 *
 * @interface ChromaDBAddDocumentsRequestBody
 * @property {string[]} ids - Unique identifiers for each document being added.
 * Existing ids are skipped (including the document and metadata at that index).
 * @property {string[]} documents - The text content of the documents to insert.
 * @property {Metadata[]} metadatas - Metadata objects associated with each document.
 * Each entry in `documents` and `metadatas` corresponds to the id at the same index.
 */
export interface ChromaDBAddDocumentsRequestBody {
    ids: string[];
    documents: string[];
    metadatas: Metadata[];
}

/**
 * The request to be sent to Chroma
 *
 * @interface ChromaDBQuery
 * @property {string} query - The text query to search for.
 * @property {Where} [where] - Optional filter criteria for the query.
 * For structure, see https://docs.trychroma.com/docs/querying-collections/metadata-filtering.
 * @property {number} [nResults] - Optional number of results to return (defaults to `defaultNResults`).
 * @property {number} [distanceCutoff] - Optional filter critera for similarity (0 to 1; 0 is equal and >0.5 is unrelated)
 */
export interface ChromaDBQuery {
    query: string;
    where?: Where;
    nResults?: number;
    distanceCutoff?: number;
}

/**
 * Represents the response body returned from a ChromaDB query.
 *
 * @interface ChromaDBGetResponseBody
 * @property {string[]} ids - Array of document IDs corresponding to each document.
 * @property {(string | null)[]} documents - Array of document texts. Null indicates a missing document.
 * @property {(Metadata | null)[]} metadatas - Array of metadata objects for each document. Null indicates missing metadata.
 */
export interface ChromaDBGetResponseBody {
    ids: string[];
    documents: (string | null)[];
    metadatas: (Metadata | null)[];
}

/**
 * Represents a single result item from a ChromaDB similarity search.
 *
 * @interface ChromaDBQueryResultItem
 * @property {string | undefined} id - The unique identifier of the document.
 * @property {string | null | undefined} document - The text content of the document, or null/undefined if missing.
 * @property {Metadata | null | undefined} metadata - Metadata associated with the document, or null/undefined if missing.
 * @property {number | undefined} distance - The similarity distance from the query. Lower values indicate higher similarity.
 */
export interface ChromaDBQueryResultItem {
    id: string | undefined;
    document: string | null | undefined;
    metadata: Metadata | null | undefined;
    distance: number | undefined;
}