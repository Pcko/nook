import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mongoose from 'mongoose';

//Connection and configuration files
import 'dotenv/config';
import './database/connection.js';

import { PublishedPage, PageAsset } from './util/internal.js';
import { PageView } from './util/internal.js';
import IPublishedPage from './types/IPublishedPage.js';
import type IPageAsset from './types/IPageAsset.js';
import { getReferrerUrl, getVisitorHash } from './util/pageView.js';
import { startOfDay, toISODate } from './util/statsComputer.js';
import { decodeStoredString } from './util/compression.js';

const allowedOrigins: string[] = [process.env.APP_URL] as string[];

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
app.get('/assets/:assetId', async (req: Request<{ assetId: string }>, res: Response) => {
    try {
        const { assetId } = req.params;
        if (!mongoose.isValidObjectId(assetId)) {
            return res.sendStatus(404);
        }

        const publishedPage = await PublishedPage.findOne({ isPublic: true, assetIds: assetId }).lean<IPublishedPage>();
        if (!publishedPage) {
            return res.sendStatus(404);
        }

        const asset = await PageAsset.findById(assetId).lean<IPageAsset>();
        if (!asset) {
            return res.sendStatus(404);
        }

        res.setHeader('Content-Type', asset.contentType || 'application/octet-stream');
        res.setHeader('Content-Length', String(asset.byteSize || asset.data.length));
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.status(200).send(asset.data.buffer);
    } catch (err) {
        console.error('❌ Get published asset error:', err);
        return res.sendStatus(500);
    }
});

app.get('/:authorId/:pageName', async (req: Request<{ authorId: string; pageName: string }>, res: Response) => {
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
            userAgent: String(req.headers['user-agent'] || ''),
        }).catch((err) => {
            console.error('❌ Page view logging error:', err);
        });

        const html = decodeStoredString(published.html, published.htmlEncoding);
        if (html == null) {
            return res.sendStatus(500);
        }

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);
    } catch (err) {
        console.error('❌ Get published page error:', err);
        return res.sendStatus(500);
    }
});

app.get('/', async (req: Request, res: Response) => {
    const pages = await PublishedPage.find({ isPublic: true }).lean<IPublishedPage[]>() ?? [];
    return res.status(200).json(pages.map((page) => ({
        ...page,
        html: decodeStoredString(page.html, page.htmlEncoding),
    })));
});

app.get('/search', async (req: Request<{}, {}, {}, { searchQuery: string }>, res: Response) => {
    try {
        const response = await fetch(`${process.env.RAG_URL}/chroma/search?searchQuery=${req.query.searchQuery}`, {
            method: 'GET',
            headers: {
                authorization: process.env.RAG_API_KEY || '',
            },
        });

        if (!response.ok || !response.body) {
            console.error(await response.text());
            return res.sendStatus(500);
        }

        const pageUIDs: string[] = await response.json();

        const queries = pageUIDs.map((pageUID) => {
            const [author, name] = pageUID.split('/');
            return { author, name };
        });

        const pages = await PublishedPage.find({ $or: queries }).lean<IPublishedPage[]>();

        return res.status(200).send(pages.map((page) => ({
            ...page,
            html: decodeStoredString(page.html, page.htmlEncoding),
        })));
    } catch (err) {
        console.log('page search error', err);
        return res.sendStatus(500);
    }
});

if (process.env.DEVENV) {
    app.listen(PORT, () => {
        console.log('✅ Server deployed at: http://localhost:' + PORT);
    });
}

export default app;