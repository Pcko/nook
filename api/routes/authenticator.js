import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';

import User from '../database/models/user-schema.js';
//import RefreshToken from '../database/models/refreshToken-schema.js'; <-- NOT IMPLEMENTED (WIP)

const router = express.Router();


// LOGIN AUTHENTICATOR REQUEST
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; // Extract data from the request body

    if (!username || !password) {
      return res.sendStatus(400);
    }


    const userResult = await User.findOne({ username }).lean();

    if (!userResult) {
      return res.status(403).send({ message: 'Username or password is invalid!' });
    }

    const match = await bcrypt.compare(password, userResult.password);

    if (!match) {
      return res.status(403).send({ message: 'Username or password is invalid!' });
    }


    const userid = userResult._id;
    const user = { id: userid };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30min' }); //valid for 30min after creation
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    //await RefreshToken.create({ token: refreshToken }); <-- NOT IMPLEMENTED (WIP)

    res.status(200).json({ accessToken, refreshToken });
  }
  catch (e) {
    console.error("❌Login error:", e);
    return res.sendStatus(500);
  }
});


// ACCOUNT REGISTRATION REQUEST
router.post('/register', async (req, res) => {
  try {
    const { username, password, firstName, lastName, email } = req.body;

    //make sure request body is not invalid
    if (![username, password, firstName, lastName, email].every(Boolean)) {
      return res.sendStatus(400);
    }

    //search for username in db
    const userExists = await User.findOne({ _id: username }).lean();
    if (userExists) {
      return res.status(409).send({ message: 'This username is not available' });
    }

    //create new user and inserting new user into db
    await User.create({
      _id: username,
      username,
      password,
      firstName,
      lastName,
      email,
    })

    res.sendStatus(201);
  }
  catch (e) {
    console.error("❌Registration error:", e);
    return res.sendStatus(500);
  }
});

// REFRESH TOKEN REQUEST
router.get('/token', async (req, res) => {
  try {
    const { token: refreshToken } = req.body;

    if (!refreshToken) {
      return res.sendStatus(400);
    }

    const tokenExists = await RefreshToken.findOne({ token: refreshToken }); //<-- NOT IMPLEMENTED (WIP)
    if (!tokenExists) {
      return res.status(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }

      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30min' }); //valid for 30min after creation

      res.status(200).json({ accessToken });
    })
  }
  catch (e) {
    console.error("❌Refresh token error:", e);
    return res.sendStatus(500);
  }
});


export default router;