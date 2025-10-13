import type {Metadata} from "chromadb";

export interface ChromaDBAddDocumentsRequestBody {
    ids: string[];
    documents: string[];
    metadatas: Metadata[];
}