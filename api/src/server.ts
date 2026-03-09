import express, {Request, Response} from 'express';
import cors from 'cors';
import cookies from 'cookie-parser';

//Connection and configuration files
import 'dotenv/config';
import './database/connection.js';
import {logger, httpLogger} from "./util/logger.js";

//Express routes and middleware
import authenticateToken from './middlewares/auth-token.js';
import authRouter from './routes/authenticator.js';
import settingsRouter from './routes/settings.js';
import pageRouter from './routes/pages.js';
import ragRouter from './routes/rag.js';
import publishingRouter from './routes/publishing.js';
import statsRouter from './routes/stats.js';

//ENV variable check
const requiredENV = [
    'MONGODB_URI',
    'DB_NAME',
    'PORT',
    'PUBLISH_PORT',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'APP_URL',
    'RAG_URL',
    'RAG_API_KEY'
];
const missingENV = requiredENV.filter((name) => !process.env[name]);
if (missingENV.length){
    logger.warn(`Missing environment variables: ${missingENV.join(", ")}`);
}

//Server settings
const allowedOrigins: string[] = [process.env.APP_URL, process.env.RAG_URL] as string[];

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(cookies());
app.use(express.json({limit: '16mb'}));
app.use(httpLogger);

//Routes
app.use('/auth', authRouter);
app.use('/api/settings', authenticateToken, settingsRouter);
app.use('/api/pages', authenticateToken, pageRouter);
app.use('/api/generation', authenticateToken, ragRouter);
app.use('/api/stats', authenticateToken, statsRouter);
app.use('/api/publishPage', authenticateToken, publishingRouter)

app.get('/api/health', (req: Request, res: Response) => {
    req.log.info('Health check successful');
    res.send('✅ API is running!');
});

if (process.env.DEVENV) {
    app.listen(PORT, () => {
        logger.info('Server deployed at: http://localhost:' + PORT);
    });
}

export default app;