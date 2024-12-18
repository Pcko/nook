import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '..', 'app', 'dist');

const app = express();
const PORT = process.env.PORT || 8080;

const devUsername = 'admin';
const devPassword = '1234567890';

app.use(express.static(clientPath));
app.use(express.json());

app.post('/api/login', (req, res) => {
    const data = req.body; // Extract data from the request body
    console.log(data);

    if(data.username !== devUsername || data.password !== devPassword){
      res.status(403).send({message: 'Username or password incorrect'});
      return;
    };
    
    res.status(200).send({message: 'User credentials valid'});
  });

app.listen(PORT, () => {
    console.log('Server deployed at: ' + PORT);
});

