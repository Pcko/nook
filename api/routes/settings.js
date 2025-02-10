import express from 'express';

const router = express.Router();

router.patch('/user', async (req, res) => {
    try {
        const body = req.body;
    
        //make sure request body is not invalid
        if (!body.username) {
          return res.sendStatus(400);
        }

        //find user and alter the corresponding userdata
        const user = await User.findOne({ _id: body.username });
        Object.keys(body).forEach(key => {
            if(key !== 'username'){
                user[key] = body[key];
            }
        });
        user.save();

        res.sendStatus(200);
      }
      catch (e) {
        console.error("❌ Alter user error:", e);
        return res.sendStatus(500);
      }
})

export default router;