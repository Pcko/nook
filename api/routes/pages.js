import express from 'express';

import Project from '../database/models/project-schema.js';
import Page from '../models/page-schema.js';

import { isInvalidStringForURL } from "../util/FormChecks.js";

const router = express.Router();

//CREATE PAGE
router.post('/:projectName/pages', async (req, res) => {
    try {
        const { userId } = req;
        const { pageName, folderName } = req.body;
        const { projectName } = req.params;

        //make sure all parameters are trimmed
        const pageNameTrimmed = pageName.trim();
        const folderNameTrimmed = folderName && folderName.trim();
        const projectNameTrimmed = projectName.trim();

        //make sure request body has all required information
        if (![pageNameTrimmed].every(Boolean)) {
            return res.sendStatus(400);
        }

        //make sure the pageName is valid
        if (isInvalidStringForURL(pageNameTrimmed)) {
            return res.sendStatus(403);
        }

        const project = await Project.findOne({ name: projectNameTrimmed, author: userId }).lean();
        if (!project) {
            return res.status(404).send('Project not found!');
        }

        /*
        const page = await Page.findOne({ name: pageNameTrimmed, projectId: project._id });
        if (!page) {
            return res.status(404).send('Page not found!');
        }
            */

        let updatedPageName = pageNameTrimmed;
        let duplicateNumber = 1;
        let pageExists = undefined;
        do {
            pageExists = await Page.findOne({ name: pageNameTrimmed, projectId: project._id });

            if (pageExists) {
                duplicateNumber += 1;
                updatedPageName = `${pageNameTrimmed} (${duplicateNumber})`;
            }
        }
        while (pageExists);

        const pageData = {
            name: updatedPageName,
            data: {},
            projectId: project._id,
        };
        if (folderNameTrimmed) {
            pageData.folderName = folderNameTrimmed;
        }
        const pageDetails = await Page.create(pageData);

        return res.status(200).json({ pageName: updatedPageName, pageDetails });
    } catch (e) {
        console.error('❌ Create project error: ', e);
        return res.sendStatus(500);
    }
});

//UPDATE PAGE
router.patch('/:projectName/pages/:pageName', async (req, res) => {
    try {
        const { userId } = req;
        const { projectName, pageName } = req.params;
        const { newPageName, newFolderName, pageContent } = req.body;

        //make sure all parameters are trimmed
        const projectNameTrimmed = projectName.trim();
        const pageNameTrimmed = pageName.trim();

        //make sure request body has all required information
        if (!userId || !projectNameTrimmed || !pageNameTrimmed) {
            return res.sendStatus(400);
        }

        const project = await Project.findOne({ name: projectNameTrimmed, author: userId });
        if (!project) {
            return res.status(404).send('Project not found!');
        }

        const pages = { ...project.pages };

        const selectedPage = pages[pageNameTrimmed];
        if (!selectedPage) {
            return res.status(404).send('Page not found!')
        }

        //Rename
        let updatedPageName = pageNameTrimmed;

        if (newPageName) {
            const newPageNameTrimmed = newPageName.trim();
            //make sure the pageName is valid
            if (isInvalidStringForURL(newPageNameTrimmed)) {
                return res.sendStatus(403);
            }

            updatedPageName = newPageNameTrimmed;

            let duplicateNumber = 1;
            let pageExists = undefined;
            do {
                pageExists = pages[updatedPageName];

                if (pageExists) {
                    duplicateNumber += 1;
                    updatedPageName = `${newPageNameTrimmed} (${duplicateNumber})`;
                }
            }
            while (pageExists);

            pages[updatedPageName] = pages[pageName];
            delete pages[pageName];
        }

        //Save data
        if (pageContent) {
            pages[updatedPageName] = { ...pages[updatedPageName], data: pageContent };
        }

        //Update Folder
        if (newFolderName) {
            const newFolderNameTrimmed = newFolderName.trim();
            //make sure the folderName is valid
            if (isInvalidStringForURL(newFolderNameTrimmed)) {
                return res.sendStatus(403);
            }

            pages[updatedPageName] = { ...pages[updatedPageName], folderName: newFolderNameTrimmed };
        }

        project.pages = pages;
        await project.save();

        return res.status(200).json({ newPageName: updatedPageName });
    } catch (e) {
        console.error('❌ Update page error: ', e);
        return res.sendStatus(500);
    }
});

//DELETE PAGE
router.delete('/:projectName/pages/:pageName', async (req, res) => {
    try {
        const { userId } = req;
        const { projectName, pageName } = req.params;

        //make sure all parameters are trimmed
        const projectNameTrimmed = projectName.trim();
        const pageNameTrimmed = pageName.trim();

        //make sure request body has all required information
        if (!userId || !projectNameTrimmed || !pageNameTrimmed) {
            return res.sendStatus(400);
        }

        const project = await Project.findOne({ name: projectNameTrimmed, author: userId });

        if (!project) {
            return res.status(404).send('Project not found!');
        }

        const pages = { ...project.pages };
        const pageExists = pages[pageNameTrimmed];

        if (!pageExists) {
            return res.status(404).send('Page not found!');
        }

        delete pages[pageNameTrimmed];

        project.pages = pages;
        await project.save();

        return res.sendStatus(200);
    } catch (e) {
        console.error('❌ Delete page error: ', e);
        return res.sendStatus(500);
    }
});

export default router;