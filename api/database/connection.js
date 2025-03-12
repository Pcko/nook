import mongoose from 'mongoose';

import 'dotenv/config';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
if (!uri) {
    throw new Error('❌ Environment variable (MONGODB_URI) missing!');
}
if (!dbName) {
    throw new Error('❌ Environment variable (DB_NAME) missing!');
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