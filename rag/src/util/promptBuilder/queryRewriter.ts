import type LlmClient from "../../clients/llmClient.js";
import {readFileSync} from "fs";
import type ChatCompletionMessageParam from "../../types/ChatCompletionMessageParam.js";
import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rewritePrompt = readFileSync(path.resolve(__dirname, "rewrite-query.txt"), "utf-8");

/**
 * Query Rewriter for vector database requests.
 *
 * @param {string} query - The original query to be rewritten.
 * @param {LlmClient} llmClient - The LLM client to use for the prompt.
 *
 * @returns {Promise<string[]>} - The queries to be used for the vector database request.
 */
export default async function rewriteQuery (query: string, llmClient: LlmClient): Promise<string[]> {
    const messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: rewritePrompt,
        },
        {
            role: "user",
            content: query,
        }
    ];

    const { response } = await llmClient.getResponse(messages);
    const queries = response.trim()
        .split(/\r?\n/)
        .filter(line => line.startsWith("- "))
        .map(line => line.substring(2).trim());

    return queries;
}