import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '..', 'app', 'dist');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(clientPath));
app.use(express.json());


import loginRoute from './routes/auth-login.js';
app.use('/api', loginRoute); //<-- login authenticator route


app.listen(PORT, () => {
    console.log('Server deployed at: ' + PORT);
});