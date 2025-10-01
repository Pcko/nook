import type { Metadata } from "chromadb";

export interface ChromaDBGetResponseBody {
    documents: (string | null)[];
    ids: string[];
    metadatas: (Metadata | null)[];
}