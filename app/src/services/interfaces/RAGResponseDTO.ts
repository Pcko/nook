
/**
 * RAGResponseDTO
 *
 * Standardized shape of the AI/RAG response returned by the backend.
 * Keeps both the final answer and optional “thinking”/debug information
 * together with basic timing/latency data.
 */
export interface RAGResponseDTO {
    /**
     * Optional chain-of-thought or reasoning content from the model.
     * Depending on the backend, this may be:
     * - Hidden from end-users and used only for debugging or logging.
     * - A summarized explanation of how the answer was derived.
     */
    think: string;

    /**
     * Final user-facing answer produced by the model.
     * This is what should be rendered in the UI.
     */
    response: string;

    /**
     * Total duration of the request in milliseconds (or another time unit, depending
     * on backend definition). Can be used for latency metrics or simple UX hints.
     */
    total_duration: number;
}
