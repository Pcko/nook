import jwt from 'jsonwebtoken';
import User from '../database/models/user-schema.js';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(400);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, tokenContent) => {
        if (err) {
            return res.status(401).json({ error: 'invalid_token' });
        }

        const { id, v } = tokenContent;
        const user = await User.findOne({ _id: id }).lean();

        if(user.tokenVersion !== v){
            return res.status(401).json({ error: 'invalid_token' });
        }

        req.userId = id;
        next();
    })
}

export default authenticateToken;