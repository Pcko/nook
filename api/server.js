import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '..', 'app', 'dist');


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
//app.use(express.static(clientPath));


import loginRoute from './routes/auth-login.js';
app.use('/api', loginRoute); //<-- login authenticator route

import recordRoute from './routes/records.js';
app.use('/record', recordRoute);


app.listen(PORT, () => {
    console.log('Server deployed at: ' + PORT);
});