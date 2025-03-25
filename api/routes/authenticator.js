import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';

import User from '../database/models/user-schema.js';
import {
    isInvalidStringForEmail,
    isInvalidStringForFirstName,
    isInvalidStringForLastName,
    isInvalidStringForPassword,
    isInvalidStringForUsername
} from '../util/FormChecks.js'

const router = express.Router();

// LOGIN AUTHENTICATOR REQUEST
router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        //make sure request body has all required information
        if (![username, password].every(Boolean)) {
            return res.sendStatus(400);
        }

        //make sure all parameters are trimmed
        const usernameTrimmed = username.trim();
        const passwordTrimmed = password.trim();

        const user = await User.findOne({_id: usernameTrimmed});

        //make sure username exists
        if (!user) {
            return res.status(403).send({message: 'Username or password is invalid!'});
        }

        //validate password
        const match = await bcrypt.compare(passwordTrimmed, user.password);
        if (!match) {
            return res.status(403).send({message: 'Username or password is invalid!'});
        }

        //create tokens for authentication
        await user.updateTokenVersion();
        const userid = user._id;
        const tokenVersion = Number(user.tokenVersion);
        const tokenUser = {id: userid, version: tokenVersion};

        const {accessToken, refreshToken} = createTokens(tokenUser);

        //create new user to return for settings
        const newUser = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }

        return res.status(200).json({user: newUser, accessToken, refreshToken});
    } catch (e) {
        console.error("❌ Login error: ", e);
        return res.sendStatus(500);
    }
});

// ACCOUNT REGISTRATION REQUEST
router.post('/register', async (req, res) => {
    try {
        const {username, password, firstName, lastName, email} = req.body;

        //make sure request body has all required information
        if (![username, password, firstName, lastName, email].every(Boolean)) {
            return res.sendStatus(400);
        }

        //make sure all parameters are trimmed
        const usernameTrimmed = username.trim();
        const passwordTrimmed = password.trim();
        const firstNameTrimmed = firstName.trim();
        const lastNameTrimmed = lastName.trim();
        const emailTrimmed = email.trim();

        //make sure all parameters are valid
        if (isInvalidStringForUsername(usernameTrimmed) ||
            isInvalidStringForPassword(passwordTrimmed) ||
            isInvalidStringForFirstName(firstNameTrimmed) ||
            isInvalidStringForLastName(lastNameTrimmed) ||
            isInvalidStringForEmail(emailTrimmed)) {
            return res.status(400).send({
                message: 'Parameters invalid!',
                errors: {
                    username: isInvalidStringForUsername(usernameTrimmed),
                    password: isInvalidStringForPassword(passwordTrimmed),
                    firstName: isInvalidStringForFirstName(firstNameTrimmed),
                    lastName: isInvalidStringForLastName(lastNameTrimmed),
                    email: isInvalidStringForEmail(emailTrimmed),
                }
            });
        }

        //make sure username is not already used
        const userExists = await User.findOne({_id: usernameTrimmed}).lean();
        if (userExists) {
            return res.status(409).send({message: 'This username is not available'});
        }

        //create new user and insert new user into database
        await User.create({
            _id: usernameTrimmed,
            usernameTrimmed,
            passwordTrimmed,
            firstNameTrimmed,
            lastNameTrimmed,
            emailTrimmed,
        })

        return res.sendStatus(201);
    } catch (e) {
        console.error("❌ Registration error: ", e);
        return res.sendStatus(500);
    }
});

// REFRESH TOKEN REQUEST
router.post('/token', async (req, res) => {
    try {
        const {token: refreshToken} = req.body;

        if (!refreshToken) {
            return res.sendStatus(400);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, tokenContent) => {
            if (err) {
                return res.status(401).json({error: 'invalid_token'});
            }

            const {id, version} = tokenContent;
            const user = await User.findOne({_id: id});

            if (user.tokenVersion !== version) {
                return res.status(401).json({error: 'invalid_token'});
            }

            await user.updateTokenVersion();
            const tokens = createTokens({id, version: user.tokenVersion});

            return res.status(200).json(tokens);
        })
    } catch (e) {
        console.error("❌ Refresh token error: ", e);
        return res.sendStatus(500);
    }
});

function createTokens(tokenContent) {
    const accessToken = jwt.sign(tokenContent, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15min'}); //valid for 15min after creation
    const refreshToken = jwt.sign(tokenContent, process.env.REFRESH_TOKEN_SECRET);

    return {accessToken, refreshToken};
}

export default router;