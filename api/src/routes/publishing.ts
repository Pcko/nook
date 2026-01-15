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
        //make sure the pageName is valid
        if (isInvalidStringForURL(pageName)) {
            return res.status(400).json({error: 'invalid_pageName'});
        }

        const pageDocument = await Page.findOne({name: pageName, author: userId}).lean<IPage>();
        if (!pageDocument) {
            return res.status(404).json({error: 'page_missing'});
        }

        const publishedPage = {
            name: pageName,
            html: page,
            author: userId,
        }

        const pageDetails = await PublishedPage.create(publishedPage) as IPublishedPage
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

/**
 * @route GET /api/publishPage/:username/:pageName
 * @summary Returns a published page (html) for rendering in the frontend
 *
 * @param {Request<{ username: string; pageName: string }, {}, {}>} req
 *      @property {string} req.params.username - Author username
 *      @property {string} req.params.pageName - Published page name
 *
 * @returns 200 - JSON{ name, author, html }
 * @returns 404 - JSON{ error: 'published_page_not_found' }
 */
router.get('/published/:authorId/:pageName', async (req: Request, res: Response) => {
    try {
        const {authorId, pageName} = req.params;

        if (isInvalidStringForURL(authorId) || isInvalidStringForURL(pageName)) {
            return res.status(400).json({error: 'invalid_params'});
        }

        const published = await PublishedPage.findOne({author: authorId, name: pageName}).lean<IPublishedPage>();

        if (!published) {
            return res.status(404).json({error: 'published_page_not_found'});
        }

        return res.status(200).send(published.html);
    } catch (err) {
        console.error('❌ Get published page error: ', err);
        return res.sendStatus(500);
    }
});

export default router;