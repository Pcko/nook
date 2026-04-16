import {type Request, type Response, Router} from "express";

import chromaClient from "../clients/chromadbClient.js";
import type {ChromaDBAddDocumentsRequestBody, ChromaDBPageIndexRequestBody, ChromaDBQuery} from "../dto/chroma.js";
import {promptBuilder} from "../util/promptBuilder/promptBuilder.js";
import {clients} from "./ragRouter.js";

const chromaRouter = Router();

chromaRouter.get('/entries', async (req : Request, res : Response) => {
    res.status(200).send(await chromaClient.getEntries());
});

chromaRouter.post('/query', async (req: Request<{}, {}, ChromaDBQuery>, res: Response) => {
    try{
        res.status(200).send(await chromaClient.query(req.body));
    } catch (error) {
        if(error instanceof TypeError) {
            res.status(400).send("Bad Request: (TypeError) Is your request formed properly? Check your 'where' clause syntax first.");
        } else {
            res.sendStatus(500);
        }
    }
});

chromaRouter.post('/addDocuments', async (req: Request<{}, {}, ChromaDBAddDocumentsRequestBody>, res: Response) => {
    res.status(201).send(await chromaClient.addDocuments(req.body));
});

chromaRouter.delete('/removeEntries', async (req: Request<{}, {}, { ids: string[] }>, res: Response) => {
   await chromaClient.removeEntries(req.body.ids);
   res.sendStatus(202);
});

chromaRouter.delete('/clearCollection', async (req: Request, res: Response) => {
   await chromaClient.clearCollection();
   res.sendStatus(202);
});

chromaRouter.post('/indexPage', async (req: Request<{}, {}, ChromaDBPageIndexRequestBody>, res: Response)=> {
    if (!req.body.username || !req.body.pageName || !req.body.pageContent) {
        return res.sendStatus(400);
    }

    (async () => {
        const descriptionMessages = promptBuilder.buildPageDescriptionMessages(
            req.body.username, req.body.pageName, req.body.pageContent);

        const description = (await clients['local'].getResponse(descriptionMessages)).response;

        await chromaClient.indexPage(req.body.username, req.body.pageName, description)
    })();

    return res.sendStatus(202);
});

chromaRouter.get('/search', async (req: Request<{}, {}, {}, {searchQuery: string}>, res: Response) => {
    if (!req.query.searchQuery) {
        return res.sendStatus(400);
    }

    return res.status(200).send(await chromaClient.searchIndexedPages(req.query.searchQuery));
});

chromaRouter.delete('/deleteIndex', async (req: Request<{}, {}, { username: string, pageName: string }>, res: Response) => {
    await chromaClient.deleteIndex(req.body.username, req.body.pageName);
    return res.sendStatus(204);
});

export default chromaRouter;
