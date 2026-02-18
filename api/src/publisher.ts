import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import 'dotenv/config';
import './database/connection.js'; //<-- database

import { PublishedPage } from "./database/models/publishedPage-schema.js";
import { PageView } from "./util/internal.js";
import IPublishedPage from "./types/IPublishedPage.js";
import { getReferrerUrl, getVisitorHash } from "./util/pageView.js";
import { startOfDay, toISODate } from "./util/statsComputer.js";

const app = express();
const PORT: number = parseInt(process.env.PUBLISH_PORT || '3001', 10);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '16mb' }));

app.get('/health', (req: Request, res: Response) => res.send('✅ Publish-API is running!'));

/**
 * @route GET /:username/:pageName
 * @summary Returns a published page (html) for rendering in the frontend
 * @param {Request<{ username: string; pageName: string }, {}, {}>} req
 * @property {string} req.params.username - Author username
 * @property {string} req.params.pageName - Published page name
 * @returns 200 - JSON{ name, author, html } * @returns 404 - HTML{fileNotFoundErrorPage.html}
 */
app.get("/:authorId/:pageName", async (req: Request, res: Response) => {
    try {
        const { authorId, pageName } = req.params;

        const published = await PublishedPage.findOne({ author: authorId, name: pageName }).lean<IPublishedPage>();

        if (!published) {
            return res.status(404).sendFile(path.join(__dirname, '..', '/src/publishing/fileNotFoundErrorPage.html'));
        }

        const viewedAt = new Date();

        PageView.create({
            pageName,
            publishedPageId: published._id,
            author: authorId,
            day: toISODate(startOfDay(viewedAt)),
            viewedAt,
            visitorHash: getVisitorHash(req),
            referrer: getReferrerUrl(req),
            userAgent: String(req.headers["user-agent"] || ""),
        }).catch((err) => {
            console.error("❌ Page view logging error:", err);
        });

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(200).send(published.html);
    } catch (err) {
        console.error("❌ Get published page error:", err);
        return res.sendStatus(500);
    }
});

app.get("/", async (req: Request, res: Response) => {
    const pages = await PublishedPage.find({isPublic: true}) ?? [];
    return res.status(200).json(pages);
});


if (process.env.DEVENV) {
    app.listen(PORT, () => {
        console.log('✅ Server deployed at: http://localhost:' + PORT);
    });
}

export default app;
