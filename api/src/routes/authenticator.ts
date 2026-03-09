import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, {Request, Response} from 'express';
import speakeasy from 'speakeasy';
import rateLimit from 'express-rate-limit';

import {sendOTPEmail, User} from '../util/internal.js';
import {
    isInvalidStringForEmail,
    isInvalidStringForFirstName,
    isInvalidStringForLastName,
    isInvalidStringForPassword,
    isInvalidStringForUsername
} from '../util/FormChecks.js';
import {
    LoginBody,
    RegisterBody,
    TokenContent,
    VerifyEmailBody,
} from '../types/requests/auth.js';
import IUser from '../types/IUser.js';
import {logger} from "../util/logger.js";

const router = express.Router();

const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 15,
    message: {
        message: 'Too many attempts. Please try again in 5 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * @route POST /auth/login
 * @summary Handles user login
 *
 * @param {Request<{}, {}, LoginBody>} req
 *      @property {string} req.body.username - Username
 *      @property {string} req.body.password - User-password
 *      @property {string} [req.body.otp] - Optional 2FA One-Time-Password
 *
 * @returns 200 - JSON{user<UserObject>, accessToken<string>, refreshToken<string>}
 */
router.post('/login', rateLimiter, async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
        req.log.debug({body: req.body}, 'Login')
        const {username, password, otp} = req.body;

        //make sure all parameters are valid
        const result =
            isInvalidStringForUsername(username) ||
            isInvalidStringForPassword(password);
        if (result) {
            return res.status(400).send({
                error: 'invalid_parameters',
                message: result,
            });
        }

        const user = await User.findOne({_id: username}) as IUser | null;

        //make sure user exists
        if (!user) {
            return res.status(400).send({message: 'Username or password is invalid!'});
        }

        /* done as soon as frontend exists
        if (!process.env.DEVENV && !user.emailVerified) {
            await sendEmailVerificationEmail(user);
            return res.status(403).send({ error: 'email-not-verified' })
        }
        */

        //validate password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send({message: 'Username or password is invalid!'});
        }

        //check for twoFactorAuthentication
        if (user.twoFactorAuthOn) {
            if (!otp) {
                return res.status(202).send({message: 'Please send auth-passcode!'});
            }

            const userSecret = user.twoFactorAuthSecret;

            if (!speakeasy.totp.verify({
                secret: userSecret!,
                encoding: 'base32',
                token: otp
            })) {
                return res.status(400).send({message: 'One time password is invalid!'})
            }
        }

        //create and add tokens to cookies for authentication
        await createTokenCookies(user, res);

        //create new userobject to return for settings
        const newUser = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            twoFactorAuthOn: user.twoFactorAuthOn,
        }

        return res.status(200).json({user: newUser});
    } catch (err) {
        logger.error(err, 'Login error');
        return res.sendStatus(500);
    }
});

/**
 * @route POST /auth/register
 * @summary Handles user registration
 *
 * @param {Request<{}, {}, RegisterBody>} req
 *      @property {string} req.body.username - Username
 *      @property {string} req.body.password - User-Password
 *      @property {string} req.body.firstName - User's first name
 *      @property {string} req.body.lastName - User's last name
 *      @property {string} req.body.email - User's email address
 *
 * @returns 201
 */
router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    try {
        const {username, password, firstName, lastName, email} = req.body;

        //make sure all parameters are valid
        const result =
            isInvalidStringForUsername(username) ||
            isInvalidStringForPassword(password) ||
            isInvalidStringForFirstName(firstName) ||
            isInvalidStringForLastName(lastName) ||
            isInvalidStringForEmail(email);
        if (result) {
            return res.status(400).send({
                error: 'invalid_parameters',
                message: result,
            });
        }

        //make sure username is not already used
        const userExists = await User.findOne({_id: username}).lean<IUser>();
        if (userExists) {
            return res.status(409).send({message: 'This username is not available!'});
        }

        const secret = speakeasy.generateSecret({name: `NOOK: ${username}`});

        //create new user and insert new user into database
        const user = await User.create({
            _id: username,
            username: username,
            password,
            firstName: firstName,
            lastName: lastName,
            email: email,
            twoFactorAuthSecret: secret.base32,
        });

        await sendEmailVerificationEmail(user);

        return res.sendStatus(202);
    } catch (err) {
        logger.error(err, 'Registration error');
        return res.sendStatus(500);
    }
});

/**
 * @route PATCH /auth/verifyEmail
 * @summary Verifies the otp sent to a users email
 *
 * @param {Request} req
 *      @property {string} req.body.username - Username
 *      @property {string} req.body.otp - One-time-password
 *
 * @returns 200
 */
router.patch('/verifyEmail', async (req: Request<{}, {}, VerifyEmailBody>, res: Response) => {
    try {
        const {username, otp} = req.body;
        if (!username || !otp) {
            return res.status(400).json({error: 'parameter-missing'});
        }

        const user = await User.findById(username) as IUser;
        const userSecret = user.twoFactorAuthSecret as string;

        if (!speakeasy.totp.verify({
            secret: userSecret,
            encoding: 'base32',
            token: otp,
            step: 600,
            window: 1
        })) {
            return res.status(403).send({message: 'One time password is invalid!'})
        }

        user.emailVerified = true;
        await user.save();

        return res.sendStatus(200);
    } catch (err) {
        logger.error(err, 'Email verification error');
        return res.sendStatus(500);
    }
})

/**
 * @route POST /auth/token
 * @summary Generates new tokens
 *
 * @returns 200 - JSON{accessToken<string>, refreshToken<string>}
 */
router.post('/token', async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(400);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: any, tokenContent: any) => {
            if (err) {
                return res.status(401).json({error: 'invalid_token'});
            }

            const {id, version} = tokenContent;
            const user = await User.findOne({_id: id}) as IUser | null;

            if (!user) {
                return res.status(404).json({error: 'unknown_user'})
            }

            if (user.tokenVersion !== version) {
                return res.status(401).json({error: 'old_token'});
            }

            await createTokenCookies(user, res);

            return res.sendStatus(200);
        })
    } catch (err) {
        logger.error(err, 'Refresh token error');
        return res.sendStatus(500);
    }
});

async function createTokenCookies(user: IUser, res: Response) {

    await user.updateTokenVersion();
    const {accessToken, refreshToken} = getTokens({id: user._id, version: user.tokenVersion});

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: !process.env.DEVENV,
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: !process.env.DEVENV,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
}

function getTokens(tokenContent: TokenContent) {
    const accessToken = jwt.sign(tokenContent, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '15min'}); //valid for 15min after creation
    const refreshToken = jwt.sign(tokenContent, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: '30d'}); //valid for 30 days after creation

    return {accessToken, refreshToken};
}

async function sendEmailVerificationEmail(user: IUser) {
    var otp = speakeasy.totp({
        secret: user.twoFactorAuthSecret!,
        encoding: 'base32',
        step: 600 // specified in seconds
    });

    await sendOTPEmail(user.email, 'Your email verification code!', otp);
}

export default router;