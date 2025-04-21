import express from 'express';

import Project from '../database/models/project-schema.js';
import Page from '../database/models/page-schema.js';

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

        let updatedPageName = pageNameTrimmed;
        let duplicateNumber = 1;
        let pageExists = undefined;
        do {
            pageExists = await Page.findOne({ name: pageNameTrimmed, projectId: project._id }).lean();

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

        const project = await Project.findOne({ name: projectNameTrimmed, author: userId }).lean();
        if (!project) {
            return res.status(404).send({message: 'Project not found!'});
        }

        const page = await Page.findOne({name: pageNameTrimmed, projectId: project._id});
        if (!page) {
            return res.status(404).send({message: 'Page not found!'});
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
            let pageExists;
            do {
                pageExists = await Page.findeOne({name: updatedPageName, projectId: project._id}).lean();

                if (pageExists) {
                    duplicateNumber += 1;
                    updatedPageName = `${newPageNameTrimmed} (${duplicateNumber})`;
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
            const newFolderNameTrimmed = newFolderName.trim();

            page.folderName = newFolderNameTrimmed;
        }

        await page.save();
        
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

        const project = await Project.findOne({ name: projectNameTrimmed, author: userId }).lean();
        if (!project) {
            return res.status(404).send({message: 'Project not found!'});
        }

        const page = await Page.findOneAndDelete({name: pageNameTrimmed, projectId: project._id});
        if (!page) {
            return res.status(404).send({message: 'Page not found!'});
        }

        return res.sendStatus(200);
    } catch (e) {
        console.error('❌ Delete page error: ', e);
        return res.sendStatus(500);
    }
});

export default router;