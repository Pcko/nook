import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: 'html/css' },
    root: '../client'
  });

  // Use Vite's middleware to serve frontend files
  app.use(vite.middlewares);
  app.use(cors())

  // Example API route
  app.post('/login', (req, res) => {
    console.log('in server')
    const data = req.body; // Extract data from the request body
    console.log(data);
    res.status(200).send({ message: 'Data received successfully', receivedData: data });
  });

  app.listen(PORT, () => {
    console.log('Server running at port: ' + PORT);
  });
}

startServer();