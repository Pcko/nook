import express from 'express';

import Project from '../database/models/project-schema.js';

const router = express.Router();

//CREATE PAGE
router.post('/:projectName/pages', async (req, res) => {
    try {
        const { userId } = req;
        const { pageName, folderName } = req.body;
        const { projectName } = req.params;

        //make sure request body has all required information
        if (![pageName].every(Boolean)) {
            return res.sendStatus(400);
        }

        let project = await Project.findOne({ name: projectName, author: userId });

        if(!project){
            return res.status(404).send('Project not found!');
        }

        const pages = { ...project.pages };

        let updatedPageName = pageName;
        let duplicateNumber = 1;

        let pageExists = undefined;
        do {
            pageExists = pages[updatedPageName];

            if (pageExists) {
                duplicateNumber += 1;
                updatedPageName = `${pageName} (${duplicateNumber})`;
            }
        }
        while (pageExists);

        pages[updatedPageName] = { folderName:folderName || 'General', data: {} };
        project.pages = pages;
        await project.save();

        return res.status(200).json({pageName: updatedPageName, pageDetails: pages[updatedPageName]});
    }
    catch (e) {
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

        const project = await Project.findOne({ name: projectName, author: userId });
        if (!project) {
            return res.status(404).send('Project not found!');
        }

        const pages = { ...project.pages };

        const selectedPage = pages[pageName];
        if(!selectedPage){
            return res.status(404).send('Page not found!')
        }

        //Rename
        let updatedPageName = pageName;
        if (newPageName) {
            updatedPageName = newPageName;
            let duplicateNumber = 1;
    
            let pageExists = undefined;
            do {
                pageExists = pages[updatedPageName];
    
                if (pageExists) {
                    duplicateNumber += 1;
                    updatedPageName = `${pageName} (${duplicateNumber})`;
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
        if(newFolderName){1
            pages[updatedPageName] = { ...pages[updatedPageName], folderName: newFolderName };
        }

        project.pages = pages;
        await project.save();

        return res.status(200).json({newPageName: updatedPageName});
    }
    catch (e) {
        console.error('❌ Update page error: ', e);
        return res.sendStatus(500);
    }
});

//DELETE PAGE
router.delete('/:projectName/pages/:pageName', async (req, res) => {
    try {
        const { userId } = req;
        const { projectName, pageName } = req.params;

        const project = await Project.findOne({ name: projectName, author: userId });

        if (!project) {
            return res.status(404).send('Project not found!');
        }

        const pages = { ...project.pages };
        const pageExists = pages[pageName];

        if(!pageExists){
            return res.status(404).send('Page not found!');
        }

        delete pages[pageName];

        project.pages = pages;
        await project.save();

        return res.sendStatus(200);
    }
    catch (e) {
        console.error('❌ Delete page error: ', e);
        return res.sendStatus(500);
    }
});

export default router;