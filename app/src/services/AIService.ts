import {RAGQueryBody} from "./interfaces/RAGQueryBody.ts";
import {RAGResponseDTO} from "./interfaces/RAGResponseDTO.ts";
import axios from "../components/auth/AxiosInstance";
import RAGElementEditResponseDTO from "./interfaces/RAGElementEditResponseBody.ts";
import {ChatObject} from "./interfaces/ChatMessage.ts";

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

    static async editElement(body: ChatObject): Promise<RAGElementEditResponseDTO> {
        const websiteData = JSON.parse(body.websiteData);
        let trimmedWebsiteData = body.websiteData;
        let trimmedMessages = body.messages;
        const replacedImages :{ base64: string, placeholder: string }[] = [];

        for(let asset of websiteData.assets) {
            if(asset.type == "image" && asset.src.startsWith("data:image/")) {
                const hash = Array.from(new Uint8Array(
                    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(asset.src))))
                    .map(b=> b.toString(16).padStart(2, "0"))
                    .join("").slice(0, 8);

                const placeholderName = `__${hash}-${asset.name}__`
                trimmedWebsiteData = trimmedWebsiteData.replaceAll(asset.src, placeholderName);
                replacedImages.push({base64: asset.src, placeholder: placeholderName});
                for(let message of trimmedMessages) {
                    message.content = message.content.replaceAll(asset.src, placeholderName);
                }
            }
        }

        body.websiteData = trimmedWebsiteData;
        body.messages = trimmedMessages;

        const response = await axios.post<RAGElementEditResponseDTO>("/api/generation/editElement", body, axiosConfig);

        let dataString = JSON.stringify(response.data);
        replacedImages.forEach((image) => {
            dataString = dataString.replaceAll(image.placeholder, image.base64);
        });

        return JSON.parse(dataString);
    }
}

export default AIService;