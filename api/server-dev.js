import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

const devUsername = 'admin'
const devPassword = '1234567890'

async function startServer() {

  app.use(cors())
  app.use(express.json());

  const vite = await createViteServer({
    server: { middlewareMode: 'html' },
    root: '../app'
  });

  // Example API route
  app.post('/login', (req, res) => {
    const data = req.body; // Extract data from the request body
    console.log(data);

    if(data.username === devUsername || data.password == devPassword){
      res.status(401).send({message: 'Username or password incorrect'})
      return;
    }
    
    res.status(200).send({message: 'Usercredentials valid'})
  });

  // Use Vite's middleware to serve frontend files
  app.use(vite.middlewares);

  app.listen(PORT, () => {
    console.log('Server running at port: ' + PORT);
  });
}

startServer();