import express from 'express';
import speakeasy from 'speakeasy';

import User from '../database/models/user-schema.js';

const router = express.Router();

// SAVE SETTINGS REQUEST
router.patch('/', async (req, res) => {
  try {
    const { userId } = req;
    const { account } = req.body.changes;

    //make sure request body is not invalid
    if (!userId) {
      return res.sendStatus(400);
    }

    if (account) {
      //find user and alter the corresponding userdata
      const user = await User.findOne({ _id: userId });
      Object.keys(account).forEach(key => {
        if (key !== 'username') {
          user[key] = account[key];
        }
      });
      await user.save();
    }

    res.sendStatus(200);
  }
  catch (err) {
    console.error("❌ Alter settings error: ", err);
    return res.sendStatus(500);
  }
});

// ACCOUNT DELETION REQUEST
router.delete('/delete-account', async (req, res) => {
  try {
    const { userId } = req;
    const { username } = req.body;

    //make sure request body has all required information
    if (!userId || !username) {
      return res.sendStatus(400);
    }

    //make sure all parameters are trimmed
    const usernameTrimmed = username.trim();

    if (usernameTrimmed !== req.userId) {
      return res.status(403).send({ error: 'username_inconsistency' });
    }

    const user = await User.findOneAndDelete({ _id: usernameTrimmed });
    //make sure username exists
    if (!user) {
      return res.sendStatus(404);
    }

    return res.sendStatus(200);
  }
  catch (err) {
    console.error("❌ Account deletion error: ", err);
    return res.sendStatus(500);
  }
});

// ACTIVATE TWO FACTOR AUTH REQUEST
router.get('/twoFactorAuth', async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    const secret = speakeasy.generateSecret({ name: `NOOK: ${userId}` });
    user.twoFactorAuthSecret = secret.base32;
    await user.save();

    return res.json({ qrCodeUrl: secret.otpauth_url });
  }
  catch (err) {
    console.error("❌ Activate TwoFactorAuth error:", err);
    return res.sendStatus(500);
  }
});

// TOGGLE TWO FACTOR AUTH REQUEST
router.post('/twoFactorAuth', async (req, res) => {
  try {
    const { userId } = req;
    const { otp, isEnabled } = req.body;

    const user = await User.findById(userId);
    const userSecret = user.twoFactorAuthSecret;

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

// LOGOUT REQUEST
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findOne({ _id: userId })
    await user.updateTokenVersion();

    return res.sendStatus(200);
  }
  catch (err) {
    console.error("❌ Logout error:", err);
    return res.sendStatus(500);
  }
});

export default router;