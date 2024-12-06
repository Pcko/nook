import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT || 8080;

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: 'html' },
    root: '../client'
  });

  // Use Vite's middleware to serve frontend files
  app.use(vite.middlewares);

  // Example API route
  app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from Express!' });
  });

  app.listen(PORT, () => {
    console.log('Server running at port: ' + PORT);
  });
}

startServer();