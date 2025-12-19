import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import 'dotenv/config';

//ENV variable check
const requiredENV = [
    'MONGODB_URI',
    'DB_NAME'
];
const missingENV = requiredENV.filter((name) => !process.env[name]);
if (missingENV.length) {
    console.error(`❌ Missing environment variables: ${missingENV.join(", ")}`);
}

(async () => {
    await import('./dist/database/connection.js'); //<-- database connection script

    const __dirname = path.dirname(fileURLToPath(import.meta.url) + "\one-time");

    const currentOTIteration = 0; //WIP

    const files = fs
        .readdirSync(__dirname)
        .filter(f => !f.startsWith("_") && parseInt(f.substring(0, 2)) >= currentOTIteration);

    for (const file of files) {
        await import(`./one-time/${file}`);
    }

    process.exit(0);
})()