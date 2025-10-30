import type {Metadata, Where} from "chromadb";

export interface ChromaDBAddDocumentsRequestBody {
    ids: string[];
    documents: string[];
    metadatas: Metadata[];
}

export interface ChromaDBQuery {
    query: string,
    where?: Where;
    nResults?: number,
    distanceCutoff?: number,
}

export interface ChromaDBGetResponseBody {
    documents: (string | null)[];
    ids: string[];
    metadatas: (Metadata | null)[];
}

export interface ChromaDBQueryResultItem {
    id: string | undefined;
    document: string | null | undefined;
    metadata: Metadata | null | undefined;
    distance: number | undefined;
}