import db from "../database/connection.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
  const data = req.body; // Extract data from the request body

  if (!data) {
    return res.sendStatus(400);
  }

  let collection = await db.collection('users');
  let result = await collection.findOne({ username: data.username });

  const match = await bcrypt.compare(data.password, result.password);

  if (!match) {
    return res.status(403).send({ message: 'Username or password is invalid!' });
  }

  let userid = result._id;
  const user = { id: userid };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 30 * 60 }); //valid for 30min after creation

  res.status(200).json({ accessToken: accessToken, });
});

export default router;