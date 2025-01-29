import db from "../database/connection.js";
import express from 'express';
const router = express.Router();

//Dashboard request
import authenicateToken from './auth-token.js';
router.get('/dashboard', authenicateToken, async (req, res) => {
    res.send('It`s working. (Obviously)');
})

export default router;