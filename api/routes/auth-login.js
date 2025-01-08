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
    res.status(403);
    return;
  }

  let userid = result._id;

  console.log('First') //dev
  console.log(process.env.ACCESS_TOKEN_SECRET) //dev
  const accessToken = jwt.sign(userid, process.env.ACCESS_TOKEN_SECRET)

  console.log({ accessToken: accessToken })

  console.log('Second')
  const user = { id: userid }
  const accessToken2 = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

  console.log({ accessToken: accessToken2 })

  //res.status(200).;
});

export default router;