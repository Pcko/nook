import express, {Request, Response} from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import cors from 'cors';

import 'dotenv/config';
import './database/connection.js'; //<-- database connection script

import authenticateToken from './routes/auth-token.js';
import authRouter from './routes/authenticator.js'; //<-- account authenticator route (incl. registration)
import settingsRouter from './routes/settings.js';
import pageRouter from './routes/pages.js';
import ragRouter from './routes/rag.js';
import publishingRouter from './routes/publishing.js';
import publishedPageRouter from './routes/publishedPage.js'
import statsRouter from './routes/stats.js';

//ENV variable check
const requiredENV = [
    'MONGODB_URI',
    'DB_NAME',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'APP_URL',
    'RAG_URL',
    'RAG_API_KEY'
];
const missingENV = requiredENV.filter((name) => !process.env[name]);
if (missingENV.length) {
    console.error(`⚠️ Missing environment variables: ${missingENV.join(", ")}`);
}

//Server settings
const allowedOrigins: string[] = [process.env.APP_URL, process.env.RAG_URL] as string[];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '..', 'app', 'dist');

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.json({limit: '16mb'}));
app.use(express.static(clientPath));

//Routes
app.use('/auth', authRouter);
app.use('/api/settings', authenticateToken, settingsRouter);
app.use('/api/pages', authenticateToken, pageRouter);
app.use('/api/generation', ragRouter);
app.use('/api/publishPage', authenticateToken, publishingRouter)
app.use('/api/published', publishedPageRouter)
app.use('/api/stats', authenticateToken, statsRouter)

app.get('/api/health', (req: Request, res: Response) => res.send('✅ API is running!'));

if (process.env.DEVENV) {
    app.listen(PORT, () => {
        console.log('✅ Server deployed at: http://localhost:' + PORT);
    });
}

export default app;