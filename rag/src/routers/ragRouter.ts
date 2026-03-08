import {type Request, type Response, Router} from "express";

import {promptBuilder} from "../util/promptBuilder/promptBuilder.js";
import type {ElementEditRequestBody, ElementEditResponseBody, QueryRequestBody, QueryResponseBody} from "../dto/rag.js";
import type ChatCompletionMessageParam from "../types/ChatCompletionMessageParam.js";
import type LlmClient from "../clients/llmClient.js";
import OpenAiClient from "../clients/openAiClient.js";
import GroqClient from "../clients/groqClient.js";

const ragRouter = Router();

const clients = {
    'groq': new GroqClient(),
    'local': new OpenAiClient(`http://localhost:${process.env.LLM_API_PORT || '11434'}/v1/chat/completions`),
};
const defaultClient = 'groq'

ragRouter.post('/query', async (req: Request<{}, {}, QueryRequestBody>, res: Response<QueryResponseBody | { error: string }>) => {
    const queryRequest = req.body;

    const llmClient: LlmClient = clients[queryRequest.provider || defaultClient];

    const messages: ChatCompletionMessageParam[] = await promptBuilder.build(queryRequest, llmClient);

    if(queryRequest.stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const callback = (chunk: string) => {
            res.write(chunk);
        }

        await llmClient.streamResponse(messages, callback);

        return res.end();
    } else {
        const queryResponse = await llmClient.getResponse(messages);

        return res.status(200).send(queryResponse);
    }
});

ragRouter.post('/editElement', async (req: Request<{}, {}, ElementEditRequestBody>, res: Response<ElementEditResponseBody>)=> {
    const requestBody: ElementEditRequestBody = req.body;

    const llmClient: LlmClient = clients[requestBody.provider || defaultClient];
    const messages = await promptBuilder.buildElementEditMessages(requestBody, llmClient);
    const queryResponseBody = await llmClient.getResponse(messages);

    const parts: { styles: Array<Object>, component: string, text: string } = JSON.parse(queryResponseBody.response);
    return res.status(200).send({
        think: queryResponseBody.think,
        text: parts.text,
        styles: parts.styles,
        component: parts.component,
        total_duration: queryResponseBody.total_duration
    });
});

export const llmClient = clients[defaultClient];
export default ragRouter;