import express, { Request, Response } from 'express';

import { PublishPageBody, PublishPageParams } from '../types/requests/publishing.js';
import { PublishedPage, Page } from '../util/internal.js';
import IPublishedPage from '../types/IPublishedPage.js';
import IPage from '../types/IPage.js';
import { logger } from '../util/logger.js';
import { extractInlineImagesInHtml, rewritePrivateAssetUrlsToPublic } from '../util/pageAssets.js';

const router = express.Router();

const ragHeaders = {
    authorization: process.env.RAG_API_KEY || '',
    'Content-Type': 'application/json',
};

/**
 * @route POST /api/publishPage/
 * @summary Publishes page and makes it reachable via the username. Can be called again for updating the deployment
 *
 * @param {Request<PublishPageParams, {}, PublishPageBody>} req
 *      @property {string} req.userId - Authenticated user's ID (gets internally fetched from headers (auth-token.ts))
 *      @property {string} req.body.page - Page as a html string
 *      @property {string} req.body.isPublic - Boolean to determent the status of a page
 *      @property {string} req.params.pageName - Name of the to be published Page
 *      @property {string} req.params.displayPageName - Name used for public access
 *
 * @returns 201 - JSON{pageDetails<IPublishedPage>}
 */
router.post('/:pageName/:displayPageName', async (req: Request<PublishPageParams, {}, PublishPageBody>, res: Response) => {
    try {
        const { userId } = req;

        const { pageName, displayPageName } = req.params;
        const { page, isPublic } = req.body;
        const isPublicDeployment = isPublic === true;
        const deploymentStatus = isPublicDeployment ? 'online' : 'inactive';

        const pageDocument = await Page.findOne({ name: pageName, author: userId }).lean<IPage>();

        if (!pageDocument) {
            return res.status(404).json({ error: 'page_missing' });
        }

        if (!page) {
            return res.status(400).json({ error: 'page_missing_html' });
        }

        const publicAssetHtml = rewritePrivateAssetUrlsToPublic(page);
        const externalizedInlineImages = await extractInlineImagesInHtml({
            html: publicAssetHtml.html,
            author: userId!,
        });

        const finalHtml = externalizedInlineImages.html;
        const assetIds = [...new Set([...publicAssetHtml.assetIds, ...externalizedInlineImages.assetIds])];

        const publishedPage = {
            pageId: pageDocument._id,
            name: displayPageName,
            html: finalHtml,
            assetIds,
            author: userId,
            isPublic: isPublicDeployment
        };

        const pageDetails = await PublishedPage.findOneAndUpdate(
            { pageId: pageDocument._id },
            publishedPage,
            { new: true, upsert: true, setDefaultsOnInsert: true },
        ) as IPublishedPage;

        await Page.updateOne({ _id: pageDocument._id }, { deploymentStatus });

        if (isPublicDeployment) {
            try {
                const response = await fetch(`${process.env.RAG_URL}/chroma/indexPage`, {
                    method: 'POST',
                    headers: ragHeaders,
                    body: JSON.stringify({
                        username: publishedPage.author,
                        pageName: publishedPage.name,
                        pageContent: finalHtml,
                    }),
                });

                if (!response.ok || !response.body) {
                    logger.error(await response.text());
                    return res.sendStatus(500);
                }
            } catch (err) {
                logger.error(err, 'page indexing error');
                return res.sendStatus(500);
            }
        }   

        return res.status(201).json(toPublishedPageDto(pageDetails));    
    } catch (err) {
        logger.error(err, 'Publish page error');
        return res.sendStatus(500);
    }
});

function toPublishedPageDto(page: IPublishedPage) {
    return {
        _id: page._id,
        pageId: page.pageId,
        name: page.name,
        author: page.author,
        isPublic: page.isPublic,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
    };
}

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
            return res.status(404).json({ error: 'page_not_found' });
        }

        const deletedPage = await PublishedPage.findOneAndDelete({ pageId: pageDocument._id, author: pageDocument.author });
        if (!deletedPage) {
            return res.status(404).json({ error: 'published_page_not_found' });
        }
        await Page.updateOne({ _id: pageDocument._id }, { deploymentStatus: 'not deployed' });

        try {
            const response = await fetch(`${process.env.RAG_URL}/chroma/deleteIndex`, {
                method: 'DELETE',
                headers: ragHeaders,
                body: JSON.stringify({
                    username: pageDocument.author,
                    pageName: pageDocument.name,
                }),
            });

            if (!response.ok || !response.body) {
                logger.error(await response.text());
                return res.sendStatus(500);
            }

            return res.sendStatus(200);
        } catch (err) {
            logger.error(err, 'index deletion error');
            return res.sendStatus(500);
        }
    } catch (err) {
        logger.error(err, 'Unpublish page error');
        return res.sendStatus(500);
    }
});

export default router;
