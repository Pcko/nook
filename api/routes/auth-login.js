import db from "../database/connection.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
  const data = req.body; // Extract data from the request body

  let collection = await db.collection('users');
  let result = await collection.findOne({ username: data.username });

  const match = await bcrypt.compare(data.password, result.password);

  if (!match) {
    return res.status(403);
  }

  let userid = result._id;
  const user = { id: userid };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  res.status(200).json({ accessToken: accessToken });
});

export default router;