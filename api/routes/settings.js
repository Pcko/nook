import express from 'express';

import User from '../database/models/user-schema.js';
import RefreshToken from '../database/models/refreshToken-schema.js';

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
  catch (e) {
    console.error("❌ Alter settings error: ", e);
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

    if(username !== req.userId){
      return res.status(403).send({ message: 'Access token is not issued for this username' });
    }

    const user = await User.findOneAndDelete({ _id: username });
    //make sure username exists
    if (!user) {
      return res.sendStatus(404);
    }

    return res.sendStatus(200);
  }
  catch (e) {
    console.error("❌ Account deletion error: ", e);
    return res.sendStatus(500);
  }
});

// LOGOUT REQUEST
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req;
    const tokenEntry = await RefreshToken.findOneAndDelete({ _id: userId });

    if (!tokenEntry) {
      return res.sendStatus(404);
    }

    return res.sendStatus(200);
  }
  catch (e) {
    console.error("❌ Logout error:", e);
    return res.sendStatus(500);
  }
});

export default router;