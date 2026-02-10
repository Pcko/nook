import express, {Request, Response} from "express";
import {PublishedPage} from "../database/models/publishedPage-schema.js";
import {PageView} from "../util/internal.js";
import IPublishedPage from "../types/IPublishedPage.js";
import {getReferrerUrl, getVisitorHash} from "../util/pageView.js";
import {startOfDay, toISODate} from "../util/statsComputer.js";

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
        const {authorId, pageName} = req.params;

        const published = await PublishedPage.findOne({author: authorId, name: pageName}).lean<IPublishedPage>();

        if (!published) {
            return res.status(404).json({error: "published_page_not_found"});
        }

        const viewedAt = new Date();

        PageView.create({
            pageName,
            publishedPageId: published._id,
            author: authorId,
            day: toISODate(startOfDay(viewedAt)),
            viewedAt,
            visitorHash: getVisitorHash(req),
            referrer: getReferrerUrl(req),
            userAgent: String(req.headers["user-agent"] || ""),
        }).catch((err) => {
            console.error("❌ Page view logging error:", err);
        });

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(200).send(published.html || "");
    } catch (err) {
        console.error("❌ Get published page error:", err);
        return res.sendStatus(500);
    }
});

router.get("/", async (req: Request, res: Response) => {
    const pages = await PublishedPage.find({}) ?? [];
    return res.status(200).json(pages);
});

export default router;
