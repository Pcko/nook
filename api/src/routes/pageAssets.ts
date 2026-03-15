import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import {Page, PageAsset} from '../util/internal.js';
import {logger} from '../util/logger.js';
import type IPage from '../types/IPage.js';
import {upsertBinaryAsset} from '../util/pageAssets.js';

const router = express.Router();
const rawImageBodyParser = express.raw({
    type: ['application/octet-stream', 'image/*'],
    limit: '25mb',
});

router.put('/:pageName/:assetHash', rawImageBodyParser, async (req: Request<{
    pageName: string;
    assetHash: string
}>, res: Response) => {
    try {
        const {userId} = req;

        const {pageName} = req.params;
        const contentType = String(req.query.contentType || req.header('content-type') || 'application/octet-stream');
        const body = req.body;

        if (!Buffer.isBuffer(body) || body.byteLength === 0) {
            return res.status(400).json({error: 'asset_body_missing'});
        }

        const page = await Page.findOne({name: pageName, author: userId}).lean<IPage>();
        if (!page) {
            return res.status(404).json({error: 'page_not_found'});
        }

        const asset = await upsertBinaryAsset({
            author: userId!,
            buffer: body,
            contentType,
        });

        return res.status(201).json({
            assetId: String(asset._id),
            assetRef: `asset://${String(asset._id)}`,
            url: `/api/page-assets/${String(asset._id)}/content`,
            contentType: asset.contentType,
            byteSize: asset.byteSize,
        });
    } catch (err) {
        logger.error(err, 'Upload page asset error');
        return res.sendStatus(500);
    }
});

router.get('/:assetId/content', async (req: Request<{ assetId: string }>, res: Response) => {
    try {
        const {userId} = req;
        const {assetId} = req.params;

        if (!mongoose.isValidObjectId(assetId)) {
            return res.status(404).json({error: 'asset_not_found'});
        }

        const asset = await PageAsset.findOne({_id: assetId, author: userId}).lean();
        if (!asset) {
            return res.status(404).json({error: 'asset_not_found'});
        }

        res.setHeader('Content-Type', asset.contentType || 'application/octet-stream');
        res.setHeader('Content-Length', String(asset.byteSize || asset.data.length));
        res.setHeader('Cache-Control', 'private, max-age=31536000, immutable');

        return res.status(200).send(asset.data);
    } catch (err) {
        logger.error(err, 'Read page asset error');
        return res.sendStatus(500);
    }
});

export default router;
