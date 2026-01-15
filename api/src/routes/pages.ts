import express, { Request, Response } from 'express';

import { isInvalidStringForURL } from "../util/FormChecks.js";
import { Page } from '../util/internal.js';
import IPage from '../types/IPage.js';
import { CreatePageBody, PageNameParam, UpdatePageBody } from '../types/requests/pages.js';

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
 * @returns 200 - JSON{pageDetails<IPage>}
 */
router.post('/', async (req: Request<{}, {}, CreatePageBody>, res: Response) => {
    try {
        const { userId } = req;
        const { pageName, folderName, metadata } = req.body;

        //make sure the pageName is valid
        if (isInvalidStringForURL(pageName)) {
            return res.sendStatus(400).json({ error: 'invalid_pageName' });
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

        return res.status(200).json(pageDetails);
    } catch (err) {
        console.error('❌ Create page error: ', err);
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

        const pages = await Page.find({ author: userId }).lean<IPage>();

        return res.status(200).json(pages);
    } catch (err) {
        console.error('❌ Get pages error: ', err);
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
        console.error('❌ Get page error: ', err);
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
        const { newPageName, newFolderName, pageContent, metadata } = req.body;

        const page = await Page.findOne({ name: pageName, author: userId }) as IPage;
        if (!page) {
            return res.status(404).send({ message: 'Page not found!' });
        }

        //Rename
        let updatedPageName = pageName;
        if (newPageName) {
            //make sure the pageName is valid
            if (isInvalidStringForURL(newPageName)) {
                return res.sendStatus(400).json({ error: 'invalid_pageName' });
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
        if (pageContent) {
            page.data = pageContent;
        }

        //Update Folder
        if (newFolderName) {
            page.folderName = newFolderName;
        }

        if(metadata) {
            page.metadata = metadata;
        }

        await page.save();

        return res.status(200).json({ newPageName: updatedPageName });
    } catch (err) {
        console.error('❌ Update page error: ', err);
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
        console.error('❌ Delete page error: ', err);
        return res.sendStatus(500);
    }
});

export default router;