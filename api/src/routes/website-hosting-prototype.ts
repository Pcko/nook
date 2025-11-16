import express, { Request, Response } from 'express';
import { Document } from 'mongoose';

import { GetPublicPageParams } from '../types/requests/hosting';
import { Page } from '../util/internal.js';
import IPage from '../types/page';
type IPageDocument = IPage & Document;

const router = express.Router();

router.get('/:userId/:pageName', async (req: Request<GetPublicPageParams, {}, {}>, res: Response) => {
    try {
        const { userId, pageName } = req.params;

        const page = await Page.findOne({ name: pageName, author: userId }).lean();

        if(!page){
            return res.sendStatus(404);
        }

        if(page.deploymentStatus !== "online"){
            return res.sendStatus(404);
        }

        res.send(page.data)

    } catch (err) {
        console.error('❌ Get public page error: ', err);
        return res.sendStatus(500);
    }
});

export default router;