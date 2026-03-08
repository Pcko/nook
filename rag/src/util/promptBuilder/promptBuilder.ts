import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import chromaClient from "../../clients/chromadbClient.js";
import type ChatCompletionMessageParam from "../../types/ChatCompletionMessageParam.js"
import type {ElementEditRequestBody, QueryRequestBody, WebsiteMetadata} from "../../dto/rag.js";
import rewriteQuery from "./queryRewriter.js";
import type LlmClient from "../../clients/llmClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const grapesTemplate = readFileSync( path.resolve(__dirname, "grapes-format.txt"), "utf-8");
const componentRules = readFileSync( path.resolve(__dirname, "component-rules.txt"), "utf-8");
const componentsTemplate = readFileSync( path.resolve(__dirname, "components-format.txt"), "utf-8");
const stylesTemplate = readFileSync( path.resolve(__dirname, "styles-format.txt"), "utf-8");

const promptTemplate = readFileSync( path.resolve(__dirname, "prompt.txt"), "utf-8");
const pageDescriptionPrompt = readFileSync( path.resolve(__dirname, "page-description-prompt.txt"), "utf-8");

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
     * @param {QueryRequestBody} queryRequest - The user's queryRequest object.
     * @param {LlmClient} llmClient - The LLM client to be used to rewrite the query.
     * @returns {Promise<ChatCompletionMessageParam[]>} A Promise that resolves to a fully constructed chat completion message list.
     */
    async build(queryRequest: QueryRequestBody, llmClient: LlmClient): Promise<ChatCompletionMessageParam[]> {
        let contextString = "No additional context available.";
        if (!queryRequest.skipContext) {
            try {
                let queryToRewrite = queryRequest.meta?
                    `${queryRequest.query}\nAdditional Info:\n${constructPageMeta(queryRequest.meta)}`
                    : queryRequest.query;
                contextString = await getWebsiteContext(queryToRewrite, llmClient);
            } catch (err) {
                console.error("[promptBuilder] Chroma Error:", err);
            }
        }

        let prompt = promptTemplate
            .replace("{{context}}", contextString)
            .replace("{{user-metadata}}", queryRequest.meta ? constructPageMeta(queryRequest.meta) : "No metadata available.");

        return [
            {
                role: "system",
                content: prompt
            },
            {
                role: "user",
                content: queryRequest.query
            }
        ];
    },

    /**
     * Returns the system prompt for generating a website.
     *
     * @returns {string} The prompt template
     */
    getPromptTemplate(): string {
        return promptTemplate;
    },

    /**
     * Builds chat messages for editing an element, including system instructions and user-provided messages.
     *
     * @async
     * @param {ElementEditRequestBody} elementEditRequestBody - The data needed to construct the edit messages.
     * @param {LlmClient} llmClient - The LLM client to be used to rewrite the query.
     * @returns {Promise<ChatCompletionMessageParam[]>} A Promise that resolves
     * to an array of messages ready for a chat completion API call.
     */
    async buildElementEditMessages(elementEditRequestBody: ElementEditRequestBody, llmClient: LlmClient): Promise<ChatCompletionMessageParam[]> {
        return [
            {
                role: "system",
                content: elementEditPrompt
                    .replace("{{componentId}}", elementEditRequestBody.elementId)
                    .replace("{{website-data}}", elementEditRequestBody.websiteData)
                    .replace("{{user-metadata}}", elementEditRequestBody.meta ? constructPageMeta(elementEditRequestBody.meta) : "No metadata available."),
            },
            ...elementEditRequestBody.messages
        ];
    },

    async buildPageDescriptionMessages(username: string, pageName: string, pageContent: string): Promise<ChatCompletionMessageParam[]> {
        return [
            {
                role: "system",
                content: pageDescriptionPrompt,
            },
            {
                role: "user",
                content: `username: ${username}\npageName: ${pageName}, content: ${pageContent}`
            }
        ]
    }
};

async function getWebsiteContext(query: string, llmClient: LlmClient): Promise<string> {
    const queries = await rewriteQuery(query, llmClient);
    const chromaResponse = await chromaClient.query({ queries, where: {type: {"$ne": "sample_component"}} });
    return JSON.stringify(chromaResponse);
}

function constructPageMeta(metadata: WebsiteMetadata) {
    return Object.entries(metadata).map(([key, value]) => `${key}: ${value}`).join("\n");
}