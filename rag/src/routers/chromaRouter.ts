import {type Request, type Response, Router} from "express";
import chromaClient from "../chromadbClient.js";
import type {ChromaDBAddDocumentsRequestBody, ChromaDBQuery} from "../dto/chroma.js";

const chromaRouter = Router();

chromaRouter.get('/entries', async (req : Request, res : Response) => {
    res.status(200).send(await chromaClient.getEntries());
});

chromaRouter.post('/query', async (req: Request<{}, {}, ChromaDBQuery>, res: Response) => {
    res.status(200).send(await chromaClient.query(req.body));
});

chromaRouter.post('/addDocuments', async (req: Request<{}, {}, ChromaDBAddDocumentsRequestBody>, res: Response) => {
    res.status(201).send(await chromaClient.addDocuments(req.body));
});

chromaRouter.delete('/removeEntries', async (req: Request<{}, {}, { ids: string[] }>, res: Response) => {
   await chromaClient.removeEntries(req.body.ids);
   res.sendStatus(202);
});

export default chromaRouter;
