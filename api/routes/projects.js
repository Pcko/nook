import express from 'express';

import Project from '../database/models/project-schema.js';
import { version } from 'mongoose';

const router = express.Router();

//CREATE
router.post('/', async (req, res) => {
    try {
        const { projectName } = req.body;
        const { userId } = req;

        //make sure request body has all required information
        if (![projectName].every(Boolean)) {
            return res.sendStatus(400);
        }

        let newProjectName = projectName;
        let duplicateNumber = 0;

        let projectExists = await Project.findOne({ name: newProjectName, author: userId });
        while (projectExists) {
            projectExists = await Project.findOne({ name: newProjectName, author: userId });

            if (projectExists) {
                duplicateNumber += 1;
                newProjectName = `${projectName} (${duplicateNumber})`;
            }
        }

        await Project.create({
            name: newProjectName,
            project: {},
            author: userId,
        })

        return res.sendStatus(200);
    }
    catch (e) {
        console.error('❌ Create project error: ', e);
        return res.sendStatus(500);
    }
});

//READ ALL
router.get('/', async (req, res) => {
    try {
        const { userId } = req;

        const projects = await Project.find({ author: userId });

        if (projects.length === 0) {
            return res.status(404).send({ message: 'No projects found!' });
        }

        return res.status(200).send(projects);
    }
    catch (e) {
        console.error('❌ Read all projects error: ', e);
        return res.sendStatus(500);
    }
});

//READ ONE
router.get('/:pojectName', (req, res) => {

});

//UPDATE
router.patch('/', (req, res) => {

});

//DELETE
router.delete('/', (req, res) => {

})

export default router;