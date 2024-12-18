import express from 'express';
const router = express.Router();

const devUsername = 'admin';
const devPassword = '1234567890';


router.post('/login', (req, res) => {
    const data = req.body; // Extract data from the request body
    console.log(data);

    if(data.username !== devUsername || data.password !== devPassword){
      res.status(403).send({message: 'Username or password incorrect'});
      return;
    };
    
    res.status(200).send({message: 'User credentials valid'});
  });

export default router;