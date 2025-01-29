import db from "../database/connection.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import express from 'express';
const router = express.Router();


// login authenticator request
router.post('/login', async (req, res) => {
  try {
    const body = req.body;

    //search for username in db
    const collection = await db.collection('users');
    const result = await collection.findOne({ username: body.username });

    //validate the password
    const match = await bcrypt.compare(body.password, result.password);
    if (match) {
      res.status(200).send({ message: 'User credentials valid' });
      return;
    }

    res.status(403).send({ message: 'Username or password incorrect' });
  }
  catch (e) {
    return res.sendStatus(500);
  }
});


// account registration request
router.post('/register', async (req, res) => {
  try {
    const body = req.body;

    //make sure request body is not invalid
    if (!body || !body.username || !body.password || !body.firstName || !body.lastName || !body.email) {
      return res.sendStatus(400);
    }

    //search for username in db
    const collection = await db.collection('users');
    const result = await collection.findOne({ _id: body.username });

    if (result) {
      return res.status(409).send('This username not available');
    }

    //create new user
    const newUser = {
      _id: body.username,
      username: body.username,
      password: await bcrypt.hash(body.password, 10),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email
    }

    //inserting new user into db
    await collection.insertOne(newUser);

    res.sendStatus(201);
  }
  catch (e) {
    return res.sendStatus(500);
  }
});


export default router;