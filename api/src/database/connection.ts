import mongoose from 'mongoose';

import {logger} from '../util/logger.js';

const uri: string | undefined = process.env.MONGODB_URI;
const dbName: string | undefined = process.env.DB_NAME;
if (!uri) {
    logger.fatal('Environment variable (MONGODB_URI) missing!');
    process.exit(1);
}
if (!dbName) {
    logger.fatal('Environment variable (DB_NAME) missing!');
    process.exit(1);
}

(async (): Promise<void> => {
    await mongoose.connect(uri, { dbName })
        .then(() => {
            logger.info('Connected to database.');
        })
        .catch((err) => {
            logger.error('Database connection error: ', err);
        })
})();
