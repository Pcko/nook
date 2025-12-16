import express, { Request, Response } from 'express';
import speakeasy from 'speakeasy';

import { User } from '../util/internal.js';
import IUser from '../types/IUser.js';
import { DeleteAccountBody, SaveSettingsBody, TwoFactorAuthToggleBody, VerifyEmailBody } from '../types/requests/settings.js';
import { Verify } from 'crypto';

const router = express.Router();

/**
 * @route PATCH /api/settings/
 * @summary Updates the user's settings based on the provided information
 * 
 * @param {Request<{}, {}, SaveSettingsBody>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {Object} req.body.changes - An object containing all settings that should be changed (including new settings)
 * 
 * @returns 200
 */
router.patch('/', async (req: Request<{}, {}, SaveSettingsBody>, res: Response) => {
  try {
    const { userId } = req;
    const { account } = req.body.changes;

    if (account) {
      //find user and alter the corresponding userdata
      const user = await User.findOne({ _id: userId }) as IUser;
      Object.keys(account).forEach(key => {
        if (key !== 'username') {
          (user as any)[key] = account[key];
        }
      });
      await user.save();
    }

    res.sendStatus(200);
  }
  catch (err) {
    console.error("❌ Alter settings error: ", err);
    res.sendStatus(500);
    return;
  }
});

/**
 * @route DELETE /api/settings/delete-account
 * @summary Deletes a user's account
 * 
 * @param {Request<{}, {}, DeleteAccountBody>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.body.username - Username (for additional account deletion confirmation)
 * 
 * @returns 200
 */
router.delete('/delete-account', async (req: Request<{}, {}, DeleteAccountBody>, res: Response) => {
  try {
    const { userId } = req;
    const { username } = req.body;

    if (userId !== username) {
      return res.sendStatus(400);
    }

    await User.findOneAndDelete({ _id: username });

    return res.sendStatus(200);
  }
  catch (err) {
    console.error("❌ Account deletion error: ", err);
    return res.sendStatus(500);
  }
});

/**
 * @route PATCH /api/settings/verifyEmail
 * @summary Verifies the otp sent to a users email
 * 
 * @param {Request} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.body.otp - One-time-password
 * 
 * @returns 200
 */
router.patch('/verifyEmail', async (req: Request<{}, {}, VerifyEmailBody>, res: Response) => {
  try {
    const { userId } = req;
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).send({ error: 'otp-missing' });
    }

    const user = await User.findById(userId) as IUser;
    const userSecret = user.twoFactorAuthSecret as string;

    if (!speakeasy.totp.verify({
      secret: userSecret, encoding: 'base32', token: otp
    })) {
      return res.status(403).send({ message: 'One time password is invalid!' })
    }

    user.emailVerified = true;
    await user.save();

    return res.sendStatus(200);
  }
  catch (err) {
    console.error("❌ Email verification error: ", err);
    return res.sendStatus(500);
  }
})

/**
 * @route GET /api/settings/twoFactorAuth
 * @summary Generates a QR-Code for setting up 2FA
 * 
 * @param {Request} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 * 
 * @returns 200 - JSON{qrCodeUrl<string>}
 */
router.get('/twoFactorAuth', async (req: Request, res: Response) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId) as IUser;

    const secret = speakeasy.generateSecret({ name: `NOOK: ${userId}` });
    user.twoFactorAuthSecret = secret.base32;
    await user.save();

    return res.status(200).json({ qrCodeUrl: secret.otpauth_url });
  }
  catch (err) {
    console.error("❌ Activate TwoFactorAuth error:", err);
    return res.sendStatus(500);
  }
});

/**
 * @route POST /api/settings/twoFactorAuth
 * @summary Sets 2FA on a user's account, if the correct One-Time-Password is provided
 * 
 * @param {Request<{}, {}, TwoFactorAuthToggleBody>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.body.otp - One-Time-Password
 *      @property {boolean} req.body.isEnabled - To choose if 2FA should be switched on or off
 * 
 * @returns 200
 */
router.post('/twoFactorAuth', async (req: Request<{}, {}, TwoFactorAuthToggleBody>, res: Response) => {
  try {
    const { userId } = req;
    const { otp, isEnabled } = req.body;

    if (![otp, isEnabled].every(Boolean)) {
      return res.sendStatus(400);
    }

    const user = await User.findById(userId) as IUser;
    const userSecret = user.twoFactorAuthSecret as string;

    if (!speakeasy.totp.verify({
      secret: userSecret, encoding: 'base32', token: otp
    })) {
      return res.status(403).send({ message: 'One time password is invalid!' })
    }

    user.twoFactorAuthOn = isEnabled;
    await user.save();

    return res.sendStatus(200);
  }
  catch (err) {
    console.error("❌ Confirm TwoFactorAuth error:", err);
    return res.sendStatus(500);
  }
})

/**
 * @route POST /api/settings/logout
 * @summary Handles user logout
 * 
 * @param {Request} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 * 
 * @returns 200
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { userId } = req;

    const user = await User.findOne({ _id: userId }) as IUser;
    await user.updateTokenVersion();

    return res.sendStatus(200);
  }
  catch (err) {
    console.error("❌ Logout error:", err);
    return res.sendStatus(500);
  }
});

export default router;