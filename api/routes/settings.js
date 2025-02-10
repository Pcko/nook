import express from 'express';

const router = express.Router();

router.patch('/', async (req, res) => {
    try {
        const {account} = req.body;

        if(account){
            //make sure request body is not invalid
            if (!account.username) {
              return res.sendStatus(400);
            }
    
            //find user and alter the corresponding userdata
            const user = await User.findOne({ _id: account.username });
            Object.keys(account).forEach(key => {
                if(key !== 'username'){
                    user[key] = account[key];
                }
            });
            user.save();
        }

        res.sendStatus(200);
      }
      catch (e) {
        console.error("❌ Alter settings error:", e);
        return res.sendStatus(500);
      }
})

export default router;