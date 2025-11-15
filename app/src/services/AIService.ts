import {RAGQueryBody} from "./interfaces/RAGQueryBody.ts";
import {RAGResponseDTO} from "./interfaces/RAGResponseDTO.ts";
import axios from "../components/auth/AxiosInstance";

/**
 * Shared Axios configuration used for AI-related requests.
 *
 * - `Content-Type: application/json` ensures the backend receives JSON.
 * - `timeout` limits how long the client waits for a response before failing.
 * - `timeoutErrorMessage` is used by Axios when the timeout is hit.
 */
const axiosConfig = {
    headers: {"Content-Type": "application/json"},
    timeout: 60000,
    timeoutErrorMessage: "Server did not respond.",
};

/**
 * AIService
 *
 * Small service layer for calling AI/RAG-related backend endpoints.
 * Centralizes how the frontend talks to the AI API so the rest of the app
 * can use a simple, typed method instead of dealing with Axios directly.
 */
class AIService {
    /**
     * getGeneratedPage
     *
     * Sends a RAG (Retrieval-Augmented Generation) query to the backend and
     * returns the structured AI response.
     *
     * This uses a preconfigured Axios instance (`AxiosInstance.js`) so auth
     * headers, base URL, interceptors, etc. are handled in a single place.
     *
     * @param {RAGQueryBody} body
     *   Payload containing the query, model/context options, and any other
     *   parameters required by the backend RAG endpoint.
     *
     * @returns {Promise<RAGResponseDTO>}
     *   Resolves with the parsed response body from `/api/generation/query`.
     *   The DTO shape is defined in `RAGQueryBody.ts`.
     *
     * @throws {import("axios").AxiosError}
     *   Propagates any Axios/network errors to the caller. Callers should
     *   wrap this in try/catch and surface user-friendly messages via the
     *   notification system or other UI.
     */
    static async getGeneratedPage(body: RAGQueryBody): Promise<RAGResponseDTO> {
        const response = await axios.post<RAGResponseDTO>(
            "/api/generation/query",
            body,
            axiosConfig
        );
        return response.data;
    }
}

export default AIService;