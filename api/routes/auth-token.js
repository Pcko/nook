import jwt from 'jsonwebtoken';
import RefreshToken from '../database/models/refreshToken-schema.js';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(400);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'invalid_token' });
        }
        req.userId = user.id;

        //check if this user has a refreshToken in the db
        const refreshToken = await RefreshToken.findOne({ _id: user.id }).lean();
        if (!refreshToken) {
            return res.status(401).json({ error: 'invalid_token' });
        }
        console.log(refreshToken);

        next();
    })
}

export default authenticateToken;