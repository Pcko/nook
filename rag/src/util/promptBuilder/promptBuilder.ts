import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chromaClient from "../../clients/chromadbClient.js";
import type ChatCompletionMessageParam from "../../types/ChatCompletionMessageParam.js"
import type {ElementEditRequestBody} from "../../dto/rag.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptTemplate = readFileSync( path.resolve(__dirname, "prompt.txt"), "utf-8");
const grapesTemplate = readFileSync( path.resolve(__dirname, "grapes-format.txt"), "utf-8");
const componentsTemplate = readFileSync( path.resolve(__dirname, "components-format.txt"), "utf-8");
const stylesTemplate = readFileSync( path.resolve(__dirname, "styles-format.txt"), "utf-8");
const elementEditPrompt = readFileSync( path.resolve(__dirname, "elementEdit-prompt.txt"), "utf-8");

export const promptBuilder = {
    async build(query: string, skipContext?: boolean): Promise<string> {
        let contextString = "No additional context available.";
        if (!skipContext) {
            try {
                const chromaResponse = await chromaClient.query({ query });
                contextString = JSON.stringify(chromaResponse, null, 2);
            } catch (err) {
                console.error("[promptBuilder] Chroma Error:", err);
            }
        }

        const prompt = promptTemplate
            .replace("{{grapes-format}}", grapesTemplate)
            .replace("{{components-format}}", componentsTemplate)
            .replace("{{styles-format}}", stylesTemplate)
            .replace("{{query}}", query)
            .replace("{{context}}", contextString);

        return prompt.trim();
    },

    async buildElementEditMessages(elementEditRequestBody: ElementEditRequestBody): Promise<ChatCompletionMessageParam[]> {
        return [
            {
                role: "system",
                content: elementEditPrompt
                    .replace("{{componentId}}", elementEditRequestBody.elementId)
                    .replace("{{component-format}}", componentsTemplate)
                    .replace("{{style-format}}", stylesTemplate)
                    .replace("{{website-data}}", elementEditRequestBody.websiteData),
            },
            ...elementEditRequestBody.messages
        ];
    }
};
