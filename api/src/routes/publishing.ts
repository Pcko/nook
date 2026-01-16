import express, {Request, Response} from 'express';

import {isInvalidStringForURL} from "../util/FormChecks.js";
import {PublishPageBody, PublishPageParams} from '../types/requests/publishing.js';
import {PublishedPage, Page} from '../util/internal.js';
import IPublishedPage from '../types/IPublishedPage.js';
import IPage from '../types/IPage.js';

const router = express.Router();

/**
 * @route POST /api/publishPage/
 * @summary Publishes page and makes it reachable via the username
 *
 * @param {Request<PublishPageParams, {}, PublishPageBody>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.body.page - Page as a html string
 *      @property {string} req.params.pageName - Name of the to be published Page
 *
 * @returns 201 - JSON{pageDetails<IPublishedPage>}
 */
router.post('/:pageName', async (req: Request<PublishPageParams, {}, PublishPageBody>, res: Response) => {
    try {
        const {userId} = req;
        const {pageName} = req.params;
        const {page} = req.body;

        if (isInvalidStringForURL(pageName)) {
            return res.status(400).json({error: 'invalid_pageName'});
        }

        const filter = {name: pageName, author: userId};
        const pageDocument = await Page.findOne(filter).lean<IPage>();

        if (!pageDocument) {
            return res.status(404).json({error: 'page_missing'});
        }

        const publishedPage = {
            name: pageName,
            html: page,
            author: userId,
        }


        const pageDetails = await PublishedPage.exists(filter) ?
            await PublishedPage.findOneAndUpdate(filter, publishedPage)
            : await PublishedPage.create(publishedPage) as IPublishedPage;

        return res.status(201).json(pageDetails);
    } catch (err) {
        console.error('❌ Publish page error: ', err);
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
        const {pageName} = req.params;

        const deletedPage = await PublishedPage.findOneAndDelete({name: pageName, author: userId});

        if (!deletedPage) {
            return res.status(404).json({error: 'published_page_not_found'})
        }

        return res.sendStatus(200);
    } catch (err) {
        console.error('❌ Unpublish page error: ', err);
        return res.sendStatus(500);
    }
})

export default router;