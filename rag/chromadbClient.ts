import dotenv from "dotenv";
import type {ChromadbResponseBody} from './dto/chromadbResponseBody.dto.ts';
import {ChromaClient} from "chromadb";

dotenv.config();

const client = new ChromaClient({
    host: "localhost",
    port: parseInt(process.env.CHROMADB_API_PORT || "8000"),
    ssl: false
});

const collection = await getChromaDBCollection("nook-page-generation");

export async function getChromaDBResponse(query: string, nResults: number): Promise<ChromadbResponseBody> {
    const queryResult = await collection.query({
        queryTexts: [query],
        nResults: nResults,
    });

    return {
        documents: queryResult.documents,
    };
}

export async function addChromaDBDocuments(documents: string[]) {
    
}

async function getChromaDBCollection(name: string) {
    try{
        return await client.getCollection({name});
    } catch (error) {
        return await client.createCollection({name});
    }
}