import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(400);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'invalid_token' });
        }
        req.userId = user.id;
        next();
    })
}

export default authenticateToken;