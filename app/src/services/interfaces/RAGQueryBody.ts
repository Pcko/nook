/**
 * RAGQueryBody
 *
 * Payload sent from the frontend to the RAG (Retrieval-Augmented Generation)
 * backend endpoint. Controls:
 * - the user query,
 * - whether to use retrieved context,
 * - whether to prefer a local LLM,
 * - and whether the response should be streamed.
 */
export interface RAGQueryBody {
    /**
     * Natural-language question or instruction from the user.
     * This is what the LLM ultimately answers.
     */
    query: string;

    /**
     * If true, skip retrieval of external context (documents, knowledge base, etc.)
     * and let the LLM answer from its own prior / default context only.
     * If omitted or false, the backend is expected to run retrieval as normal.
     */
    skipContext?: boolean;

    /**
     * If true, hint to the backend that a locally hosted LLM should be used
     * (e.g. for cost/privacy reasons) instead of a remote/cloud model.
     * Behaviour depends on backend configuration.
     */
    useLocalLLM?: boolean;

    /**
     * If true, ask the backend to stream the response tokens instead of returning
     * a single final chunk.
     *
     * Note: This flag only describes the intent; the actual streaming mechanism
     * (SSE, websockets, chunked HTTP, etc.) is implemented on the backend and
     * in the client code that consumes this API.
     */
    stream?: boolean;
}