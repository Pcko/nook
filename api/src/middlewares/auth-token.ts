import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { User } from '../util/internal.js';
import {logger} from "../util/logger.js";

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = (req as any).cookies?.accessToken;

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err: any, tokenContent: any) => {
        if (err) {
            return res.status(401).json({ error: 'invalid_token' });
        }

        const { id, version } = tokenContent;
        const user = await User.findOne({ _id: id }).lean();

        if (!user) {
            return res.status(401).json({ error: 'unknown_user' })
        }

        if (user.tokenVersion !== version) {
            return res.status(401).json({ error: 'invalid_token' });
        }

        req.userId = user._id;
        next();
    })
}

export default authenticateToken;