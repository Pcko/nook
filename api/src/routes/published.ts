import express, { Request, Response } from "express";
import { isInvalidStringForURL } from "../util/FormChecks.js";
import { PublishedPage } from "../database/models/publishedPage-schema.js";
import IPublishedPage from "../types/IPublishedPage.js";

const router = express.Router();

/**
 * @route GET /api/publishPage/:username/:pageName
 * @summary Returns a published page (html) for rendering in the frontend
 * @param {Request<{ username: string; pageName: string }, {}, {}>} req
 * @property {string} req.params.username - Author username
 * @property {string} req.params.pageName - Published page name
 * @returns 200 - JSON{ name, author, html } * @returns 404 - JSON{ error: 'published_page_not_found' }
*/
router.get("/:authorId/:pageName", async (req: Request, res: Response) => {
    try {
        const { authorId, pageName } = req.params;

        if (isInvalidStringForURL(authorId) || isInvalidStringForURL(pageName)) {
            return res.status(400).json({ error: "invalid_params" });
        }

        const published = await PublishedPage.findOne({
            author: authorId,
            name: pageName,
        }).lean<IPublishedPage>();

        if (!published) {
            return res.status(404).json({ error: "published_page_not_found" });
        }

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(200).send(published.html || "");
    } catch (err) {
        console.error("❌ Get published page error:", err);
        return res.sendStatus(500);
    }
});

export default router;
