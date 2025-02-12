import express from 'express';

const router = express.Router();

// SAVE SETTINGS REQUEST
router.patch('/', async (req, res) => {
  try {
    const { username, account } = req.body;

    //make sure request body is not invalid
    if (!username) {
      return res.sendStatus(400);
    }

    if (account) {
      //find user and alter the corresponding userdata
      const user = await User.findOne({ _id: username });
      Object.keys(account).forEach(key => {
        if (key !== 'username') {
          user[key] = account[key];
        }
      });
      user.save();
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
    const { username, password } = req.body;

    //make sure request body has all required information
    if (![username, password].every(Boolean)) {
      return res.sendStatus(400);
    }


    const user = await User.findOne({ _id: username });

    //make sure username exists
    if (!user) {
      return res.sendStatus(404);
    }


    await user.deleteOne();

    return res.sendStatus(200);
  }
  catch (e) {
    console.error("❌ Account deletion error: ", e);
    return res.sendStatus(500);
  }
});

export default router;