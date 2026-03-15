import express, { Request, Response } from 'express';

import { isInvalidStringForURL } from '../util/FormChecks.js';
import { Page } from '../util/internal.js';
import IPage from '../types/IPage.js';
import { CreatePageBody, PageNameParam, UpdatePageBody } from '../types/requests/pages.js';
import { logger } from '../util/logger.js';

const router = express.Router();

/**
 * @route POST /api/pages/
 * @summary Creates page
 *
 * @param {Request<{}, {}, CreatePageBody>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.body.pageName - Page name
 *      @property {string} [req.body.folderName] - Optional folder name
 *
 * @returns 201 - JSON{pageDetails<IPage>}
 */
router.post('/', async (req: Request<{}, {}, CreatePageBody>, res: Response) => {
    try {
        const { userId } = req;
        const { pageName, folderName, metadata } = req.body;

        if (isInvalidStringForURL(pageName)) {
            return res.status(400).json({ error: 'invalid_pageName' });
        }

        let updatedPageName = pageName;
        let duplicateNumber = 1;
        let pageExists = undefined;
        do {
            pageExists = await Page.findOne({ name: updatedPageName, author: userId }).lean<IPage>();

            if (pageExists) {
                duplicateNumber += 1;
                updatedPageName = `${pageName} (${duplicateNumber})`;
            }
        }
        while (pageExists);

        const pageData = {
            name: updatedPageName,
            author: userId,
            folderName: folderName || 'GENERAL',
            metadata: metadata || {},
        };

        const pageDetails = await Page.create(pageData) as IPage;

        return res.status(201).json(pageDetails);
    } catch (err) {
        logger.error(err, 'Create page error');
        return res.sendStatus(500);
    }
});

/**
 * @route GET /api/pages/
 * @summary Fetches a list of all pages the user has
 *
 * @param {Request} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *
 * @returns 200 - JSON{pages<[IPage]>}
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const { userId } = req;

        const pages = await Page.find({ author: userId })
            .select({ data: 0, dataEncoding: 0, dataVersion: 0 })
            .lean<IPage[]>();

        return res.status(200).json(pages);
    } catch (err) {
        logger.error(err, 'Get pages error');
        return res.sendStatus(500);
    }
})

/**
 * @route GET /api/pages/:pageName
 * @summary Fetches a single specified page
 *
 * @param {Request<PageNameParam, {}, {}>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.params.pageName - Page name
 *
 * @returns 200 - JSON{page<IPage>}
 */
router.get('/:pageName', async (req: Request<PageNameParam, {}, {}>, res: Response) => {
    try {
        const { userId } = req;
        const { pageName } = req.params;

        const page = await Page.findOne({ name: pageName, author: userId }).lean<IPage>();
        if (!page) {
            return res.status(404).send({ message: 'Page not found!' });
        }

        return res.status(200).json(page);
    } catch (err) {
        logger.error(err, 'Get page error');
        return res.sendStatus(500);
    }
});

/**
 * @route PATCH /api/pages/:pageName
 * @summary Updates a page based on the provided information
 *
 * @param {Request<PageNameParam, {}, UpdatePageBody>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.params.pageName - Page name
 *      @property {string} [req.body.newPageName] - Optional new page name
 *      @property {string} [req.body.newFolderName] - Optional new page name
 *      @property {string} [req.body.pageContent] - Optional page content
 *
 * @returns 200 - JSON{newPageName<string>}
 */
router.patch('/:pageName', async (req: Request<PageNameParam, {}, UpdatePageBody>, res: Response) => {
    try {
        const { userId } = req;
        const { pageName } = req.params;
        const { newPageName, newFolderName, pageContent, dataEncoding, dataVersion, metadata } = req.body;

        const page = await Page.findOne({ name: pageName, author: userId }) as IPage;
        if (!page) {
            return res.status(404).send({ message: 'Page not found!' });
        }

        let updatedPageName = pageName;
        if (newPageName) {
            if (isInvalidStringForURL(newPageName)) {
                return res.status(400).json({ error: 'invalid_pageName' });
            }

            updatedPageName = newPageName;

            let duplicateNumber = 1;
            let pageExists;
            do {
                pageExists = await Page.findOne({ name: updatedPageName, author: userId }).lean<IPage>();

                if (pageExists) {
                    duplicateNumber += 1;
                    updatedPageName = `${newPageName} (${duplicateNumber})`;
                }
            }
            while (pageExists);

            page.name = updatedPageName;
        }

        //Save data
        if (pageContent !== undefined) {
            page.data = pageContent;
            if (dataEncoding) page.dataEncoding = dataEncoding;
            if (typeof dataVersion === 'number') page.dataVersion = dataVersion;
        }

        //Update Folder
        if (newFolderName) {
            page.folderName = newFolderName;
        }

        if (metadata !== undefined) {
            page.metadata = metadata;
        }

        await page.save();

        return res.status(200).json({ newPageName: updatedPageName });
    } catch (err) {
        logger.error(err, 'Update page error');
        return res.sendStatus(500);
    }
});

/**
 * @route DELETE /api/pages/:pageName
 * @summary Deletes the specified page
 *
 * @param {Request<PageNameParam, {}, {}>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.params.pageName - Page name
 *
 * @returns 202
 */
router.delete('/:pageName', async (req: Request<PageNameParam, {}, {}>, res: Response) => {
    try {
        const { userId } = req;
        const { pageName } = req.params;

        const page = await Page.findOneAndDelete({ name: pageName, author: userId });
        if (!page) {
            return res.status(404).send({ message: 'Page not found!' });
        }

        return res.sendStatus(202);
    } catch (err) {
        logger.error(err, 'Delete page error');
        return res.sendStatus(500);
    }
});

export default router;
