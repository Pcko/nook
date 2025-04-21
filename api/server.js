import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import cors from 'cors';

import 'dotenv/config';
import './database/connection.js'; //<-- database connection script

import authenticateToken from './routes/auth-token.js';
import authRouter from './routes/authenticator.js'; //<-- account authenticator route (incl. registration)
import settingsRouter from './routes/settings.js';
import projectRouter from './routes/projects.js';
import pageRouter from './routes/pages.js';

import 'dotenv/config';

const allowedOrigins = [process.env.APP_URL];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '..', 'app', 'dist');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.json());
app.use(express.static(clientPath));

app.use('/auth', authRouter);
app.use('/api/settings', authenticateToken, settingsRouter);
app.use('/api/projects', authenticateToken, projectRouter);
app.use('/api/projects', authenticateToken, express.json({ limit: '5mb' }), pageRouter);

app.get('/api/health', (req, res) => res.send('✅ API is running!'));

app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

if(process.env.DEVENV){
    app.listen(PORT, () => {
       console.log('✅ Server deployed at: http://localhost:' + PORT);
    });
}

export default app;