import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const dbName = 'NookTestDB'; //change inbetween NookDB and NookTestDB to switch.
const uri = process.env.ATLAS_URI;
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