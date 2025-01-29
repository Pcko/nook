import { MongoClient, ServerApiVersion } from "mongodb";

import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const uri = process.env.ATLAS_URI;
if (!uri) {
    console.error('Environment variable missing!');
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    },
});

try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
    );
} catch (err) {
    console.error(err);
}

let db = client.db("NookTestDB"); //change inbetween NookDB and NookTestDB to switch.

export default db;