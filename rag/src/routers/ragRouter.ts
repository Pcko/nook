import {type Request, type Response, Router} from "express";
import { type QueryRequestBody} from "../dto/queryRequestBody.dto.js";
import chromaClient from "../chromadbClient.js";
import localLLMClient from "../localLLMClient.js";
import type {QueryResponseBody} from "../dto/queryResponseBody.dto.js";
import groqClient from "../groqClient.js";
import {promptBuilder} from "../util/promptBuilder/promptBuilder.js";

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

export default ragRouter;
