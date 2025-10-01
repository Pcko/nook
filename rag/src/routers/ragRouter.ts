import {type Request, type Response, Router} from "express";
import { type QueryRequestBody} from "../dto/queryRequestBody.dto.js";
import chromaClient from "../chromadbClient.js";
import type {LlmResponseBody} from "../dto/llmResponseBody.dto.js";
import {getLLMResponse} from "../localLLMClient.js";
import type {QueryResponseBody} from "../dto/queryResponseBody.dto.js";

const ragRouter = Router();

ragRouter.post('/query', async (req: Request<{}, {}, QueryRequestBody>, res: Response<QueryResponseBody| { error: string }>) => {
    const queryRequest = req.body;

    // Send Request to ChromaDB if queryRequest.skipContext isn't true
    let query = queryRequest.query;
    if(!queryRequest.skipContext) {
        const chromaResponse = await chromaClient.query(query);
        query = query+`\nContext: ${chromaResponse.documents}`;
    }

    // Get Response from LLM
    let llmResponse: LlmResponseBody;
    if(queryRequest.useLocalLLM) {
        llmResponse = await getLLMResponse(query);
    } else {
        return res.sendStatus(501);
    }

    // Return LLM Response
    const queryResponseBody: QueryResponseBody = llmResponse;
    res.status(200).send(queryResponseBody);
});

export default ragRouter;
