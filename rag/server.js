import 'dotenv/config';
import express from 'express';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    return res.status(200).send("Hello World!");
})

app.get('/rag', (req, res) => {
    return res.sendStatus(501);
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
