import mongoose from 'mongoose';

import dotenv from 'dotenv/config';

const dbName = process.env.DB_NAME || 'NookTestDB';
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('❌ Environment variable missing!');
}

(async () => {
    mongoose.connect(uri, { dbName })
        .then(() => {
            console.log('✅ Connected to database.');
        })
        .catch((err) => {
            throw new Error('❌ Database connection error: ', err);
        })
})();