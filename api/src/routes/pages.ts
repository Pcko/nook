import express, { Request, Response } from 'express';
import { Document } from 'mongoose';

import { isInvalidStringForURL } from "../util/FormChecks.js";
import { Page } from '../util/internal.js';
import IPage from '../types/page.js';
import { CreatePageBody, PageNameParam, UpdatePageBody } from '../types/requests/pages.js';
type IPageDocument = IPage & Document;

const router = express.Router();

//CREATE PAGE
router.post('/', async (req: Request<{}, {}, CreatePageBody>, res: Response) => {
    try {
        const { userId } = req;
        const { pageName, folderName } = req.body;

        //make sure the pageName is valid
        if (isInvalidStringForURL(pageName)) {
            return res.sendStatus(403);
        }

        let updatedPageName = pageName;
        let duplicateNumber = 1;
        let pageExists = undefined;
        do {
            pageExists = await Page.findOne({ name: pageName, author: userId }).lean();

            if (pageExists) {
                duplicateNumber += 1;
                updatedPageName = `${pageName} (${duplicateNumber})`;
            }
        }
        while (pageExists);

        const pageData = {
            name: updatedPageName,
            author: userId,
            folderName: "General"
        };

        if (folderName) {
            pageData.folderName = folderName
        }

        const pageDetails = await Page.create(pageData);

        return res.status(200).json({ pageName: updatedPageName, pageDetails });
    } catch (err) {
        console.error('❌ Create page error: ', err);
        return res.sendStatus(500);
    }
});

//READ PAGE
router.get('/', async (req: Request, res: Response) => {
    try {
        const { userId } = req;

        const pages = await Page.find({ author: userId }).lean();

        return res.send(pages);
    } catch (err) {
        console.error('❌ Get page error: ', err);
        return res.sendStatus(500);
    }
})

//UPDATE PAGE
router.patch('/:pageName', async (req: Request<PageNameParam, {}, UpdatePageBody>, res: Response) => {
    try {
        const { userId } = req;
        const { pageName } = req.params;
        const { newPageName, newFolderName, pageContent } = req.body;

        const page = await Page.findOne({ name: pageName, author: userId }) as IPageDocument;
        if (!page) {
            return res.status(404).send({ message: 'Page not found!' });
        }

        //Rename
        let updatedPageName = pageName;
        if (newPageName) {
            //make sure the pageName is valid
            if (isInvalidStringForURL(newPageName)) {
                return res.sendStatus(403);
            }

            updatedPageName = newPageName;

            let duplicateNumber = 1;
            let pageExists;
            do {
                pageExists = await Page.findOne({ name: updatedPageName, author: userId }).lean();

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

        await page.save();

        return res.status(200).json({ newPageName: updatedPageName });
    } catch (err) {
        console.error('❌ Update page error: ', err);
        return res.sendStatus(500);
    }
});

//DELETE PAGE
router.delete('/:pageName', async (req: Request<PageNameParam, {}, {}>, res: Response) => {
    try {
        const { userId } = req;
        const { pageName } = req.params;

        const page = await Page.findOneAndDelete({ name: pageName, author: userId });
        if (!page) {
            return res.status(404).send({ message: 'Page not found!' });
        }

        return res.sendStatus(200);
    } catch (err) {
        console.error('❌ Delete page error: ', err);
        return res.sendStatus(500);
    }
});

export default router;