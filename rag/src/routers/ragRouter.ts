import {type Request, type Response, Router} from "express";

import localLLMClient from "../clients/localLLMClient.js";
import groqClient from "../clients/groqClient.js";
import {promptBuilder} from "../util/promptBuilder/promptBuilder.js";
import type {ElementEditRequestBody, ElementEditResponseBody, QueryRequestBody, QueryResponseBody} from "../dto/rag.js";

const ragRouter = Router();

ragRouter.post('/query', async (req: Request<{}, {}, QueryRequestBody>, res: Response<QueryResponseBody | { error: string }>) => {
    const queryRequest = req.body;

    const prompt = await promptBuilder.build(queryRequest.query, queryRequest.skipContext);

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
            await groqClient.streamGroqResponse(prompt, callback);
        }

        return res.end();
    } else {
        let queryResponse = await (queryRequest.useLocalLLM ?
            localLLMClient.getLLMResponse(prompt) :
            groqClient.getGroqResponse(prompt)
        );

        return res.status(200).send(queryResponse);
    }
});

ragRouter.post('/editElement', async (req: Request<{}, {}, ElementEditRequestBody>, res: Response<ElementEditResponseBody>)=> {
    const messages = await promptBuilder.buildElementEditMessages(req.body);
    const queryResponseBody = await groqClient.getElementEditResponse(messages);

    const parts: { styles: string, component: string } = JSON.parse(queryResponseBody.response);
    return res.status(200).send({
        think: queryResponseBody.think,
        styles: parts.styles,
        component: parts.component,
        total_duration: queryResponseBody.total_duration
    });
});

export default ragRouter;
