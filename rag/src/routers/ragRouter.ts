import {type Request, type Response, Router} from "express";
import chromaClient from "../clients/chromadbClient.js";
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
    console.log(messages);
    return res.status(200).send(await groqClient.getElementEditResponse(messages));
});

export default ragRouter;
