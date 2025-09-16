import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import {type QueryRequestBody, isQueryRequestBody} from "./dto/queryRequestBody.dto.ts";
import {type QueryResponseBody} from "./dto/queryResponseBody.dto.ts";
import {getLLMResponse} from "./localLLMClient.ts";
import type {LlmResponseBody} from "./dto/llmResponseBody.dto.ts";
import {getChromaDBResponse} from "./chromadbClient.js";

dotenv.config();
const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    return res.status(200).send("Hello World!");
});

app.post('/query', async (req: Request, res: Response) => {
    if (req.headers['rag_api_key'] !== process.env.RAG_API_KEY) {
        return res.sendStatus(403);
    }

    const queryRequest = req.body as QueryRequestBody;
    if(!isQueryRequestBody(queryRequest)) {
        return res.sendStatus(400);
    }

    // Send Request to ChromaDB if queryRequest.skipContext isn't true
    let query = queryRequest.query;
    if(!queryRequest.skipContext) {
        const nResults = parseInt(process.env.CHROMADB_N_RESULTS || "5");
        const chromaResponse = await getChromaDBResponse(query, nResults);
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

const port = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
