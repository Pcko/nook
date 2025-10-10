import {type Request, type Response, Router} from "express";
import { type QueryRequestBody} from "../dto/queryRequestBody.dto.js";
import chromaClient from "../chromadbClient.js";
import localLLMClient from "../localLLMClient.js";
import type {QueryResponseBody} from "../dto/queryResponseBody.dto.js";
import groqClient from "../groqClient.js";

const ragRouter = Router();

ragRouter.post('/query', async (req: Request<{}, {}, QueryRequestBody>, res: Response<QueryResponseBody| { error: string }>) => {
    const queryRequest = req.body;

    let query = queryRequest.query;
    if(!queryRequest.skipContext) {
        const chromaResponse = await chromaClient.query(query);
        query = query+`\nContext: ${chromaResponse.documents}`;
    }

    console.log(queryRequest);
    if(queryRequest.stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const callback = (chunk: string) => {
            res.write(chunk);
        }

        if(queryRequest.useLocalLLM) {
            await localLLMClient.streamLLMResponse(query, callback);
        } else {
            await groqClient.streamGroqResponse(query, callback);
        }

        return res.end();
    } else {
        let queryResponse: QueryResponseBody;

        if(queryRequest.useLocalLLM) {
            queryResponse = await localLLMClient.getLLMResponse(query);
        } else {
            queryResponse = await groqClient.getGroqResponse(query);
        }

        return res.status(200).send(queryResponse);
    }
});

export default ragRouter;
