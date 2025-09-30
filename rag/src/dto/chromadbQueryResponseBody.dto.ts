import type { Metadata } from "chromadb";

export interface ChromaDBQueryResponseBody {
    documents: (string | null)[][];
}