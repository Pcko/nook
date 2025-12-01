import {type Request, type Response, Router} from "express";

import localLLMClient from "../clients/localLLMClient.js";
import groqClient from "../clients/groqClient.js";
import {promptBuilder} from "../util/promptBuilder/promptBuilder.js";
import type {ElementEditRequestBody, ElementEditResponseBody, QueryRequestBody, QueryResponseBody} from "../dto/rag.js";
import type ChatCompletionMessageParam from "../types/ChatCompletionMessageParam.js";

const ragRouter = Router();

ragRouter.post('/query', async (req: Request<{}, {}, QueryRequestBody>, res: Response<QueryResponseBody | { error: string }>) => {
    const queryRequest = req.body;

    let messages: ChatCompletionMessageParam[] = [];
    let prompt: string = "";
    if(queryRequest.useLocalLLM) {
        prompt = await promptBuilder.build(queryRequest.query, queryRequest.skipContext);
    } else {
        messages = [
            {
                role: "system",
                content: promptBuilder.getPromptTemplate()
            },
            {
                role: "user",
                content: queryRequest.query
            }
        ]
    }

    if(queryRequest.stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const callback = (chunk: string) => {
            res.write(chunk);
        }

        if(queryRequest.useLocalLLM) {
            await localLLMClient.streamLLMResponse(prompt, callback);
        } else {
            await groqClient.streamGroqResponse(messages, callback);
        }

        return res.end();
    } else {
        let queryResponse = await (queryRequest.useLocalLLM ?
            localLLMClient.getLLMResponse(prompt) :
            groqClient.getGroqResponse(messages)
        );

        return res.status(200).send(queryResponse);
    }
});

ragRouter.post('/editElement', async (req: Request<{}, {}, ElementEditRequestBody>, res: Response<ElementEditResponseBody>)=> {
    const messages = await promptBuilder.buildElementEditMessages(req.body);
    const queryResponseBody = await groqClient.getGroqResponse(messages);

    const parts: { styles: Object, component: Object, text: string } = JSON.parse(queryResponseBody.response);
    return res.status(200).send({
        think: queryResponseBody.think,
        text: parts.text,
        styles: parts.styles,
        component: parts.component,
        total_duration: queryResponseBody.total_duration
    });
});

export default ragRouter;
