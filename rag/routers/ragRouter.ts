import {type Request, type Response, Router} from "express";
import {isQueryRequestBody, type QueryRequestBody} from "../dto/queryRequestBody.dto.ts";
import chromaClient from "../chromadbClient.ts";
import type {LlmResponseBody} from "../dto/llmResponseBody.dto.ts";
import {getLLMResponse} from "../localLLMClient.ts";
import type {QueryResponseBody} from "../dto/queryResponseBody.dto.ts";

const ragRouter = Router();

ragRouter.post('/query', async (req: Request, res: Response) => {
    const queryRequest = req.body as QueryRequestBody;
    if(!isQueryRequestBody(queryRequest)) {
        return res.sendStatus(400);
    }

    // Send Request to ChromaDB if queryRequest.skipContext isn't true
    let query = queryRequest.query;
    if(!queryRequest.skipContext) {
        const chromaResponse = await chromaClient.query(query);
        query = query+`\nContext: ${chromaResponse.documents}`;
    }

    // Get Response from LLM
    let llmResponse: LlmResponseBody;
    if(queryRequest.forceGroq) {
        return res.sendStatus(501);
    } else {
        llmResponse = await getLLMResponse(query);
    }

    // Return LLM Response
    const queryResponseBody: QueryResponseBody = {
        response: llmResponse.output
    }
    res.status(200).send(queryResponseBody);
});

export default ragRouter;