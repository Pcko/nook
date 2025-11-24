import type {Request, Response, NextFunction} from "express";

/**
 * Express middleware to authenticate requests using an API key.
 *
 * Compares the `authorization` header of the request against the
 * `RAG_API_KEY` environment variable. If the key is missing or does
 * not match, responds with HTTP 403 Forbidden.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {void} Calls `next()` if authentication succeeds, otherwise sends 403.
 */
export default function authenticate(req : Request, res :Response, next: NextFunction) {
    if(!process.env.RAG_API_KEY || req.headers['authorization'] !== process.env.RAG_API_KEY) {
        return res.sendStatus(403);
    }

    next();
}
