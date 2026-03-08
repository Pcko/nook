import "dotenv/config";
import express, { type Request, type Response } from 'express';
import cors from 'cors';

import chromaRouter from "./routers/chromaRouter.js";
import ragRouter from "./routers/ragRouter.js";
import authenticate from "./interceptors/authenticateRoute.js";

if(
  !(process.env.RAG_API_KEY &&
    process.env.API_URL &&
    process.env.GROQ_API_KEY &&
    process.env.GROQ_LLM_MODEL &&
    process.env.LOCAL_LLM_MODEL &&
    process.env.EMBEDDING_MODEL)
) {
    console.error("ERROR: At least one required .env variable is not set.");
    process.exit(1);
}

const allowedOrigins: string[] = [process.env.API_URL] as string[];

const app = express();

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/chroma', authenticate, chromaRouter);
app.use('/generation', authenticate, ragRouter);

app.get('/health', (req: Request, res: Response) => {
    return res.status(200).send("Hello World!");
});

const port = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3010;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
