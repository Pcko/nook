import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import chromaClient from "../../clients/chromadbClient.js";
import type ChatCompletionMessageParam from "../../types/ChatCompletionMessageParam.js"
import type {ElementEditRequestBody} from "../../dto/rag.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const grapesTemplate = readFileSync( path.resolve(__dirname, "grapes-format.txt"), "utf-8");
const componentRules = readFileSync( path.resolve(__dirname, "component-rules.txt"), "utf-8");
const componentsTemplate = readFileSync( path.resolve(__dirname, "components-format.txt"), "utf-8");
const stylesTemplate = readFileSync( path.resolve(__dirname, "styles-format.txt"), "utf-8");

const promptTemplate = readFileSync( path.resolve(__dirname, "prompt.txt"), "utf-8")
    .replace("{{component-rules}}", componentRules)
    .replace("{{grapes-format}}", grapesTemplate)
    .replace("{{components-format}}", componentsTemplate)
    .replace("{{styles-format}}", stylesTemplate);

const elementEditPrompt = readFileSync( path.resolve(__dirname, "elementEdit-prompt.txt"), "utf-8")
    .replace("{{component-rules}}", componentRules)
    .replace("{{component-format}}", componentsTemplate)
    .replace("{{style-format}}", stylesTemplate);

/**
 * Utility for building prompts and chat messages for LLM interactions.
 */
export const promptBuilder = {
    /**
     * Builds a text prompt for a given query, optionally including context from ChromaDB.
     *
     * @async
     * @param {string} query - The main user query.
     * @param {boolean} [skipContext=false] - If true, skips fetching additional context from ChromaDB.
     * @returns {Promise<string>} A Promise that resolves to a fully constructed prompt string.
     */
    async build(query: string, skipContext?: boolean): Promise<string> {
        let contextString = "No additional context available.";
        if (!skipContext) {
            try {
                const chromaResponse = await chromaClient.query({ query });
                contextString = JSON.stringify(chromaResponse);
            } catch (err) {
                console.error("[promptBuilder] Chroma Error:", err);
            }
        }

        const prompt = promptTemplate
            .replace("{{query}}", query)
            .replace("{{context}}", contextString);

        return prompt.trim();
    },

    /**
     * Builds chat messages for editing an element, including system instructions and user-provided messages.
     *
     * @async
     * @param {ElementEditRequestBody} elementEditRequestBody - The data needed to construct the edit messages.
     * @returns {Promise<ChatCompletionMessageParam[]>} A Promise that resolves
     * to an array of messages ready for a chat completion API call.
     */
    async buildElementEditMessages(elementEditRequestBody: ElementEditRequestBody): Promise<ChatCompletionMessageParam[]> {
        return [
            {
                role: "system",
                content: elementEditPrompt
                    .replace("{{componentId}}", elementEditRequestBody.elementId)
                    .replace("{{website-data}}", elementEditRequestBody.websiteData),
            },
            ...elementEditRequestBody.messages
        ];
    }
};
