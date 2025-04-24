import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import speakeasy from 'speakeasy';

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
        const { username, password, otp } = req.body;

        //make sure all parameters are trimmed
        const usernameTrimmed = username.trim();

        //make sure request body has all required information
        if (![usernameTrimmed, password].every(Boolean)) {
            return res.sendStatus(400);
        }

        const user = await User.findOne({ _id: usernameTrimmed });

        //make sure username exists
        if (!user) {
            return res.status(403).send({ message: 'Username or password is invalid!' });
        }

        //validate password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(403).send({ message: 'Username or password is invalid!' });
        }

        //check for twoFactorAuthentication
        if (user.twoFactorAuthOn) {
            if (!otp) {
                return res.status(202).send({ message: 'Please send auth-passcode!' });
            }

            const userSecret = user.twoFactorAuthSecret;

            if (!speakeasy.totp.verify({
                secret: userSecret, encoding: 'base32', token: otp
            })) {
                return res.status(403).send({ message: 'One time password is invalid!' })
            }
        }

        return await createAndSendTokensAndUser(res, user);
    } catch (err) {
        console.error("❌ Login error: ", err);
        return res.sendStatus(500);
    }
});

// ACCOUNT REGISTRATION REQUEST
router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, email } = req.body;

        //make sure all parameters are trimmed
        const usernameTrimmed = username.trim();
        const firstNameTrimmed = firstName.trim();
        const lastNameTrimmed = lastName.trim();
        const emailTrimmed = email.trim();

        //make sure request body has all required information
        if (![usernameTrimmed, password, firstNameTrimmed, lastNameTrimmed, emailTrimmed].every(Boolean)) {
            return res.sendStatus(400);
        }

        //make sure all parameters are valid
        const result =
            isInvalidStringForUsername(usernameTrimmed) ||
            isInvalidStringForPassword(password) ||
            isInvalidStringForFirstName(firstNameTrimmed) ||
            isInvalidStringForLastName(lastNameTrimmed) ||
            isInvalidStringForEmail(emailTrimmed);
        if (result) {
            return res.status(403).send({
                error: 'invalid_parameters',
                message: result,
            });
        }

        //make sure username is not already used
        const userExists = await User.findOne({ _id: usernameTrimmed }).lean();
        if (userExists) {
            return res.status(409).send({ message: 'This username is not available!' });
        }

        //create new user and insert new user into database
        await User.create({
            _id: usernameTrimmed,
            username: usernameTrimmed,
            password,
            firstName: firstNameTrimmed,
            lastName: lastNameTrimmed,
            email: emailTrimmed,
        })

        return res.sendStatus(201);
    } catch (err) {
        console.error("❌ Registration error: ", err);
        return res.sendStatus(500);
    }
});

// REFRESH TOKEN REQUEST
router.post('/token', async (req, res) => {
    try {
        const { token: refreshToken } = req.body;

        if (!refreshToken) {
            return res.sendStatus(400);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, tokenContent) => {
            if (err) {
                return res.status(401).json({ error: 'invalid_token' });
            }

            const { id, version } = tokenContent;
            const user = await User.findOne({ _id: id });

            if (!user) {
                return res.status(401).json({ error: 'unkown_user' })
            }

            if (user.tokenVersion !== version) {
                return res.status(401).json({ error: 'invalid_token' });
            }

            await user.updateTokenVersion();
            const tokens = createTokens({ id, version: user.tokenVersion });

            return res.status(200).json(tokens);
        })
    } catch (err) {
        console.error("❌ Refresh token error: ", err);
        return res.sendStatus(500);
    }
});

async function createAndSendTokensAndUser(res, user) {
    //create tokens for authentication
    await user.updateTokenVersion();
    const userid = user._id;
    const tokenVersion = Number(user.tokenVersion);
    const tokenUser = { id: userid, version: tokenVersion };

    const { accessToken, refreshToken } = createTokens(tokenUser);

    //create new user to return for settings
    const newUser = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        twoFactorAuthOn: user.twoFactorAuthOn,
    }

    return res.status(200).json({ user: newUser, accessToken, refreshToken });
}

function createTokens(tokenContent) {
    const accessToken = jwt.sign(tokenContent, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' }); //valid for 15min after creation
    const refreshToken = jwt.sign(tokenContent, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' }); //valid for 30 days after creation

    return { accessToken, refreshToken };
}

export default router;