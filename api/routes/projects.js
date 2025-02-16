import express from 'express';

import Project from '../database/models/project-schema.js';

const router = express.Router();

//CREATE PROJECT
router.post('/', async (req, res) => {
    try {
        const { userId } = req;
        const { projectName } = req.body;

        //make sure request body has all required information
        if (![projectName].every(Boolean)) {
            return res.sendStatus(400);
        }

        let newProjectName = projectName;
        let duplicateNumber = 1;

        let projectExists = await Project.findOne({ name: newProjectName, author: userId });
        while (projectExists) {
            projectExists = await Project.findOne({ name: newProjectName, author: userId });

            if (projectExists) {
                duplicateNumber += 1;
                newProjectName = `${projectName} (${duplicateNumber})`;
            }
        }

        const project = await Project.create({
            name: newProjectName,
            pages: {},
            author: userId,
        });

        const projectDetails = {
            pageCount: project.pageCount,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };

        return res.status(200).json(projectDetails);
    }
    catch (e) {
        console.error('❌ Create project error: ', e);
        return res.sendStatus(500);
    }
});

//READ ALL PROJECTS
router.get('/', async (req, res) => {
    try {
        const { userId } = req;

        const projects = await Project.find({ author: userId });
        if (projects.length === 0) {
            return res.status(404).send({ message: 'No projects found!' });
        }

        //Object parsing for return
        const projectDetails = {};
        projects.forEach(project => {
            projectDetails[project.name] = {
                pageCount: project.pageCount,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            }
        });

        return res.status(200).json(projectDetails);
    }
    catch (e) {
        console.error('❌ Read all projects error: ', e);
        return res.sendStatus(500);
    }
});

//READ ONE PROJECT
router.get('/:projectName', async (req, res) => {
    try {
        const { userId } = req;
        const projectName = req.params.projectName;

        const project = await Project.findOne({ name: projectName, author: userId }).lean();

        if (!project) {
            return res.sendStatus(404);
        }

        return res.status(200).json(project);
    }
    catch (e) {
        console.error('❌ Read specific project error: ', e);
        return res.sendStatus(500);
    }
});

//UPDATE PROJECT
router.patch('/:projectName', async (req, res) => {
    try {
        const { userId } = req;
        const projectName = req.params.projectName;
        const { newProjectName, pages } = req.body;

        const project = await Project.findOne({ name: projectName, author: userId });
        if (!project) {
            return res.sendStatus(404);
        }

        //Rename
        if (newProjectName) {
            project.name = newProjectName;
        }

        //Save project data
        if (pages) {
            project.pages = pages;
        }

        await project.save();

        //Object parsing for return
        const projectDetails = {
            pageCount: project.pageCount,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };

        return res.status(200).json(projectDetails);
    }
    catch (e) {
        console.error('❌ Update project error: ', e);
        return res.sendStatus(500);
    }
});

//DELETE PROJECT
router.delete('/:projectName', async (req, res) => {
    try {
        const { userId } = req;
        const projectName = req.params.projectName;

        const project = await Project.findOneAndDelete({ name: projectName, author: userId }).lean();

        if (!project) {
            return res.sendStatus(404);
        }

        return res.sendStatus(200);
    }
    catch (e) {
        console.error('❌ Delete project error: ', e);
        return res.sendStatus(500);
    }
});

export default router;