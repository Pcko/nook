import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import './database/connection.js'; //<-- database connection script


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '..', 'app', 'dist');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(clientPath));


import authRoute from './routes/authenticator.js';
app.use('/auth', authRoute); //<-- account authenticator route (incl. registration)

app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});


app.listen(PORT, () => {
    console.log('✅Server deployed at: ' + PORT);
});