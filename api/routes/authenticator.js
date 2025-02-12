import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';

import User from '../database/models/user-schema.js';
import RefreshToken from '../database/models/refreshToken-schema.js';

const router = express.Router();


// LOGIN AUTHENTICATOR REQUEST
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    //make sure request body has all required information
    if (![username, password].every(Boolean)) {
      return res.sendStatus(400);
    }


    const user = await User.findOne({ _id: username }).lean();

    //make sure username exists
    if (!user) {
      return res.status(403).send({ message: 'Username or password is invalid!' });
    }

    //validate password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(403).send({ message: 'Username or password is invalid!' });
    }


    //create tokens for authentication
    const userid = user._id;
    const tokenUser = { id: userid };

    const accessToken = jwt.sign(tokenUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30min' }); //valid for 30min after creation
    const refreshToken = jwt.sign(tokenUser, process.env.REFRESH_TOKEN_SECRET);

    //delete any old token and write new refreshToken to database
    await RefreshToken.findByIdAndDelete(userid);
    await RefreshToken.create({
      _id: userid,
      token: refreshToken,
    });

    //create new user to return for settings
    const newUser = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }

    return res.status(200).json({ newUser, accessToken, refreshToken });
  }
  catch (e) {
    console.error("❌ Login error: ", e);
    return res.sendStatus(500);
  }
});

// ACCOUNT REGISTRATION REQUEST
router.post('/register', async (req, res) => {
  try {
    const { username, password, firstName, lastName, email } = req.body;

    //make sure request body has all required information
    if (![username, password, firstName, lastName, email].every(Boolean)) {
      return res.sendStatus(400);
    }


    //make sure username is not already used
    const userExists = await User.findOne({ _id: username }).lean();
    if (userExists) {
      return res.status(409).send({ message: 'This username is not available' });
    }

    //create new user and insert new user into database
    await User.create({
      _id: username,
      username,
      password,
      firstName,
      lastName,
      email,
    })

    return res.sendStatus(201);
  }
  catch (e) {
    console.error("❌ Registration error: ", e);
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
      return res.status(401).json({ error: 'invalid_token' });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30min' }); //valid for 30min after creation

    return res.status(200).json({ accessToken });
  }
  catch (e) {
    console.error("❌ Refresh token error: ", e);
    return res.sendStatus(500);
  }
});


export default router;