import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import chromaRouter from "./routers/chromaRouter.ts";
import ragRouter from "./routers/ragRouter.ts";
import authenticate from "./interceptors/authenticateRoute.ts";

dotenv.config();

const app = express();

app.use(express.json());

app.use('/chroma', authenticate, chromaRouter);
app.use('/generation', authenticate, ragRouter);

app.get('/health', (req: Request, res: Response) => {
    return res.status(200).send("Hello World!");
});

const port = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
