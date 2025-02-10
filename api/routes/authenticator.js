import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';

import User from '../database/models/user-schema.js';
import RefreshToken from '../database/models/refreshToken-schema.js';

const router = express.Router();


// LOGIN AUTHENTICATOR REQUEST
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; // Extract data from the request body

    //make sure request body is not invalid
    if (!username || !password) {
      return res.sendStatus(400);
    }


    //get user from the database
    const userResult = await User.findOne({ _id: username }).lean();

    if (!userResult) {
      return res.status(403).send({ message: 'Username or password is invalid!' });
    }

    //validate the password
    const match = await bcrypt.compare(password, userResult.password);
    if (!match) {
      return res.status(403).send({ message: 'Username or password is invalid!' });
    }


    //create tokens for authentication
    const userid = userResult._id;
    const user = { id: userid };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30min' }); //valid for 30min after creation
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    //write refreshToken to the database
    const refreshTokenResult = await RefreshToken.findOne({ _id: userid })

    if(!refreshTokenResult){
      await RefreshToken.create({
        _id: userid,
        token: refreshToken,
      });
    }

    res.status(200).json({ user: userResult, accessToken, refreshToken });
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

    //make sure username is not already used
    const userExists = await User.findOne({ _id: username }).lean();
    if (userExists) {
      return res.status(409).send({ message: 'This username is not available' });
    }

    //create new user and insert new user into the database
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

    const tokenExists = await RefreshToken.findOne({ token: refreshToken }).lean();
    if (!tokenExists) {
      return res.sendStatus(403);
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