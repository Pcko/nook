import db from "../database/connection.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import express from 'express';
const router = express.Router();

/*
const devUsername = 'admin';
const devPassword = '1234567890';

router.post('/oldlogin', (req, res) => {
  const data = req.body; // Extract data from the request body
  console.log(data);

  if (data.username !== devUsername || data.password !== devPassword) {
    res.status(403).send({ message: 'Username or password incorrect' });
    return;
  };

  res.status(200).send({ message: 'User credentials valid' });
});
*/

router.post('/login', async (req, res) => {
  const data = req.body; // Extract data from the request body

  let collection = await db.collection('users');
  let result = await collection.findOne({ username: data.username });

  const match = await bcrypt.compare(data.password, result.password);

  if (match) {
    res.status(200).send({ message: 'User credentials valid' });
    return;
  }

  res.status(403).send({ message: 'Username or password incorrect' });
});

export default router;