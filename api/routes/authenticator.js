import db from "../database/connection.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
const router = express.Router();


// LOGIN AUTHENTICATOR REQUEST
router.post('/login', async (req, res) => {
  const data = req.body; // Extract data from the request body

  if (!data || !('username' in data) || !('password' in data)) {
    return res.sendStatus(400);
  }


  const userCollection = await db.collection('users');
  const userResult = await userCollection.findOne({ username: data.username });

  if (!userResult) {
    return res.status(403).send({ message: 'Username or password is invalid!' });
  }

  const match = await bcrypt.compare(data.password, userResult.password);

  if (!match) {
    return res.status(403).send({ message: 'Username or password is invalid!' });
  }


  const userid = userResult._id;
  const user = { id: userid };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 30 * 60 }); //valid for 30min after creation
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  const tokenCollection = await db.collection('refreshTokens');
  const tokenResult = await tokenCollection.insertOne({ token: refreshToken });

  if (!tokenResult) {
    return res.sendStatus(500);
  }

  res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
});


// ACCOUNT REGISTRATION REQUEST
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

// REFRESH TOKEN REQUEST
router.get('/token', async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.sendStatus(400);
  }

  const tokenCollection = await db.collection('refreshTokens');
  const tokenResult = await tokenCollection.findOne({ token: refreshToken });

  if (!tokenResult) {
    return res.status(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 30 * 60 }); //valid for 30min after creation

    res.status(200).json({ accessToken: accessToken });
  })
})


export default router;