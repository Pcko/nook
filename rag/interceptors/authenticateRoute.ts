import type {Request, Response, NextFunction} from "express";
import dotenv from "dotenv";

dotenv.config();

export default function authenticate(req : Request, res :Response, next: NextFunction) {
    if(req.headers['authorization'] !== process.env.RAG_API_KEY) {
        return res.sendStatus(403);
    }

    next();
}