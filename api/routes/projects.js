import express from 'express';

import Project from '../database/models/project-schema.js';
import Page from '../database/models/page-schema.js';

import { isInvalidStringForURL } from "../util/FormChecks.js";

const router = express.Router();

//CREATE PROJECT
router.post('/', async (req, res) => {
    try {
        const { userId } = req;
        const { projectName } = req.body;

        //make sure all parameters are trimmed
        const projectNameTrimmed = projectName.trim();

        //make sure request body has all required information
        if (![projectNameTrimmed].every(Boolean)) {
            return res.sendStatus(403);
        }

        //make sure the projecName is valid
        if (isInvalidStringForURL(projectNameTrimmed)) {
            return res.sendStatus(403);
        }

        let newProjectName = projectNameTrimmed;
        let duplicateNumber = 1;
        let projectExists;
        do {
            projectExists = await Project.findOne({ name: newProjectName, author: userId });

            if (projectExists) {
                duplicateNumber += 1;
                newProjectName = `${projectNameTrimmed} (${duplicateNumber})`;
            }
        }
        while (projectExists);

        const project = await Project.create({
            name: newProjectName,
            pages: {},
            author: userId,
        });

        const projectDetails = {
            pageCount: project.pageCount,
            createdAt: new Date(project.createdAt),
            updatedAt: new Date(project.updatedAt),
        };

        return res.status(200).json({ projectName: newProjectName, projectDetails });
    } catch (err) {
        console.error('❌ Create project error: ', err);
        return res.sendStatus(500);
    }
});

//READ ALL PROJECTS
router.get('/', async (req, res) => {
    try {
        const { userId } = req;

        const projects = await Project.find({ author: userId });
        if (projects.length === 0) {
            return res.status(404).send({ error: 'no_existing_projects' });
        }

        //Object parsing for return
        const projectDetails = {};
        projects.forEach(project => {
            projectDetails[project.name] = {
                pageCount: project.pageCount,
                createdAt: new Date(project.createdAt),
                updatedAt: new Date(project.updatedAt),
            }
        });

        return res.status(200).json(projectDetails);
    } catch (err) {
        console.error('❌ Read all projects error: ', err);
        return res.sendStatus(500);
    }
});

//READ ONE PROJECT
router.get('/:projectName', async (req, res) => {
    try {
        const { userId } = req;
        const projectName = req.params.projectName;

        //make sure all parameters are trimmed
        const projectNameTrimmed = projectName.trim();

        //make sure request body has all required information
        if (!userId || !projectNameTrimmed) {
            return res.sendStatus(400);
        }

        const project = await Project.findOne({ name: projectNameTrimmed, author: userId }).lean();
        if (!project) {
            return res.status(404).send({ error: 'unknown_project' });
        }

        const pages = await Page.find({ projectId: project._id });
        if (!pages) {
            return res.status(404).send('No pages found!');
        }

        const pagesObj = {};
        for (let page of pages) {
            pagesObj[page.name] = page;
        }
        project.pages = pagesObj;

        return res.status(200).json(project);
    } catch (err) {
        console.error('❌ Read specific project error: ', err);
        return res.sendStatus(500);
    }
});

//UPDATE PROJECT
router.patch('/:projectName', async (req, res) => {
    try {
        const { userId } = req;
        const projectName = req.params.projectName;
        const { newProjectName, pages } = req.body;

        //make sure all parameters are trimmed
        const projectNameTrimmed = projectName.trim();

        //make sure request body has all required information
        if (!userId || !projectNameTrimmed) {
            return res.sendStatus(400);
        }

        const project = await Project.findOne({ name: projectNameTrimmed, author: userId });
        if (!project) {
            return res.status(404).send({ error: 'unknown_project' });
        }

        //Rename
        let updatedProjectName = projectNameTrimmed;
        if (newProjectName) {
            const newProjectNameTrimmed = newProjectName.trim();
            //make sure the projectName is valid
            if (isInvalidStringForURL(newProjectNameTrimmed)) {
                return res.sendStatus(400);
            }

            updatedProjectName = newProjectNameTrimmed;

            let projectExists;
            let duplicateNumber = 1;
            do {
                projectExists = await Project.findOne({ name: updatedProjectName, author: userId });

                if (projectExists) {
                    duplicateNumber += 1;
                    updatedProjectName = `${newProjectNameTrimmed} (${duplicateNumber})`;
                }
            }
            while (projectExists);

            project.name = updatedProjectName;
        }

        //Save project data
        if (pages) {
            project.pages = pages;
        }

        await project.save();

        //Object parsing for return
        const projectDetails = {
            pageCount: project.pageCount,
            createdAt: new Date(project.createdAt),
            updatedAt: new Date(project.updatedAt),
        };

        return res.status(200).json({ projectName: updatedProjectName || projectName, projectDetails });
    } catch (err) {
        console.error('❌ Update project error: ', err);
        return res.sendStatus(500);
    }
});

//DELETE PROJECT
router.delete('/:projectName', async (req, res) => {
    try {
        const { userId } = req;
        const projectName = req.params.projectName;

        //make sure all parameters are trimmed
        const projectNameTrimmed = projectName.trim();

        //make sure request body has all required information
        if (!userId || !projectNameTrimmed) {
            return res.sendStatus(400);
        }

        const project = await Project.findOneAndDelete({ name: projectNameTrimmed, author: userId }).lean();

        if (!project) {
            return res.status(404).send({ error: 'unknown_project' });
        }

        return res.sendStatus(200);
    } catch (err) {
        console.error('❌ Delete project error: ', err);
        return res.sendStatus(500);
    }
});

export default router;