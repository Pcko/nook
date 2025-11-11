import express, { Request, Response } from 'express';
import { RAGQueryBody, RAGResponseBody } from "../types/requests/rag";

const router = express.Router();

router.post('/query', async (req: Request<{}, {}, RAGQueryBody>, res: Response) => {
    try {
        const response = await fetch(`${process.env.RAG_URL}/generation/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.RAG_API_KEY || ''
            },
            body: JSON.stringify(req.body)
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
        console.error("❌ AI query error:", err);
        return res.sendStatus(500);
    }
});

export default router;
