import express, { Request, Response } from 'express';
import {
    RAGElementEditRequestBody,
    RAGElementEditResponseBody,
    RAGQueryBody,
    RAGResponseBody
} from "../types/requests/rag";
import {Page} from "../database/models/page-schema.js";
import IPage from "../types/IPage.js";
import {logger} from "../util/logger.js";

const router = express.Router();

const ragHeaders = {
    'Content-Type': 'application/json',
    authorization: process.env.RAG_API_KEY || ''
};

const charLimit = 500;
const byteLimit = 1e5;

router.post('/query', async (req: Request<{}, {}, RAGQueryBody>, res: Response) => {
    const { userId } = req;

    if(req.body.query.length > charLimit) {
        return res.sendStatus(413);
    }

    try {
        const metadata = (await Page.findOne({ name: req.body.pageName, author: userId }).lean<IPage>())?.metadata || {};

        const response = await fetch(`${process.env.RAG_URL}/generation/query`, {
            method: 'POST',
            headers: ragHeaders,
            body: JSON.stringify({
                ...req.body,
                meta: metadata
            })
        });

        if (!response.ok || !response.body) {
            console.error(await response.text());
            return res.sendStatus(500);
        }

        if (req.body.stream) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                res.write(chunk);
            }

            res.end();
        } else {
            const data: RAGResponseBody = await response.json();
            res.status(200).send(data);
        }
    } catch (err) {
        logger.error(err, "AI query error");
        return res.sendStatus(500);
    }
});

router.post('/editElement', async (req: Request<{}, {}, RAGElementEditRequestBody>, res: Response) => {
    const { userId } = req;

    if(Buffer.byteLength(JSON.stringify(req.body)) > byteLimit) {
        return res.sendStatus(413);
    }

    try {
        const metadata = (await Page.findOne({ name: req.body.pageName, author: userId }).lean<IPage>())?.metadata || {};

        const response = await fetch(`${process.env.RAG_URL}/generation/editElement`, {
            method: 'POST',
            headers: ragHeaders,
            body: JSON.stringify({
                ...req.body,
                meta: metadata
            })
        });

        if (!response.ok || !response.body) {
            console.error(await response.text());
            return res.sendStatus(500);
        }

        const body : RAGElementEditResponseBody = await response.json();
        res.status(200).send(body);
    } catch (err) {
        logger.error(err, "AI edit element error");
        return res.sendStatus(500);
    }
})

export default router;