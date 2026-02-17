import express, { Request, Response } from 'express';

import { PublishPageBody, PublishPageParams } from '../types/requests/publishing.js';
import { PublishedPage, Page } from '../util/internal.js';
import IPublishedPage from '../types/IPublishedPage.js';
import IPage from '../types/IPage.js';
import {logger} from "../util/logger.js";

const router = express.Router();

/**
 * @route POST /api/publishPage/
 * @summary Publishes page and makes it reachable via the username. Can be called again for updating the deployment
 *
 * @param {Request<PublishPageParams, {}, PublishPageBody>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.body.page - Page as a html string
 *      @property {string} req.params.pageName - Name of the to be published Page
 *      @property {string} req.params.displayPageName - Name used for public access
 *
 * @returns 201 - JSON{pageDetails<IPublishedPage>}
 */
router.post('/:pageName/:displayPageName', async (req: Request<PublishPageParams, {}, PublishPageBody>, res: Response) => {
    try {
        const { userId } = req;
        const { pageName, displayPageName } = req.params;
        const { page } = req.body;

        const pageDocument = await Page.findOne({ name: pageName, author: userId }).lean<IPage>();

        if (!pageDocument) {
            return res.status(404).json({ error: 'page_missing' });
        }

        const publishedPage = {
            pageId: pageDocument._id,
            name: displayPageName,
            html: page,
            author: userId,
        }

        const pageDetails = await PublishedPage.findOneAndUpdate(
            { pageId: pageDocument._id },
            publishedPage,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ) as IPublishedPage;

        return res.status(201).json(pageDetails);
    } catch (err) {
        logger.error(err, 'Publish page error');
        return res.sendStatus(500);
    }
});

/**
 * @route DELETE /api/publishPage/
 * @summary Unpublished a page
 *
 * @param {Request<PublishPageParams, {}, {}>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.params.pageName - Name of the published Page
 *
 * @returns 200
 */
router.delete('/:pageName', async (req: Request<PublishPageParams, {}, {}>, res: Response) => {
    try {
        const userId = req.userId;
        const { pageName } = req.params;

        const pageDocument = await Page.findOne({ name: pageName, author: userId }).lean<IPage>();
        if (!pageDocument) {
            return res.status(404).json({ error: 'page_not_found' })
        }

        const deletedPage = await PublishedPage.findOneAndDelete({ pageId: pageDocument._id, author: pageDocument.author });
        if (!deletedPage) {
            return res.status(404).json({ error: 'published_page_not_found' })
        }

        return res.sendStatus(200);
    } catch (err) {
        logger.error(err, 'Unpublish page error');
        return res.sendStatus(500);
    }
})

export default router;