import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '..', 'app');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(clientPath))

app.get('/', (req, res) => {
    res.sendFile(path.join(clientpath, 'dist', 'index.html'))
})

app.listen(PORT, () => {
    console.log('Server deployed at: ' + PORT)
})