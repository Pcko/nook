import jwt from 'jsonwebtoken';
import { User } from '../util/internal.js';
import { Request, Response, NextFunction } from 'express';
import { TokenContent } from '../types/requests/auth.js';

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err, tokenContent) => {
        if (err) {
            return res.status(401).json({ error: 'invalid_token' });
        }

        const { id, version } = tokenContent as TokenContent;
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