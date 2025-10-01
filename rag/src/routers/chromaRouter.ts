import {type Request, type Response, Router} from "express";
import chromaClient from "../chromadbClient.js";
import type {ChromaDBAddDocumentsRequestBody} from "../dto/chromaDBAddDocumentsRequestBody.dto.js";

const chromaRouter = Router();

chromaRouter.get('/entries', async (req : Request, res : Response) => {
    res.status(200).send(await chromaClient.getEntries());
});

chromaRouter.post('/query', async (req: Request<{}, {}, { query: string }>, res: Response) => {
    res.status(200).send(await chromaClient.query(req.body.query));
});

chromaRouter.post('/addDocuments', async (req: Request<{}, {}, ChromaDBAddDocumentsRequestBody>, res: Response) => {
    res.status(201).send(await chromaClient.addDocuments(req.body.ids, req.body.documents));
});

chromaRouter.delete('/removeEntries', async (req: Request<{}, {}, { ids: string[] }>, res: Response) => {
   await chromaClient.removeEntries(req.body.ids);
   res.sendStatus(202);
});

export default chromaRouter;
