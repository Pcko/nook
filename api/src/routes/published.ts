import express, { Request, Response } from "express";
import crypto from "crypto";
import { PublishedPage } from "../database/models/publishedPage-schema.js";
import { Page, PageView } from "../util/internal.js";
import IPublishedPage from "../types/IPublishedPage.js";

const router = express.Router();

function startOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function toISODate(date: Date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function getVisitorHash(req: Request) {
    const forwarded = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim();
    const ip = forwarded || req.ip || "";
    const userAgent = String(req.headers["user-agent"] || "");
    return crypto.createHash("sha256").update(`${ip}|${userAgent}`).digest("hex");
}

function normalizeReferrer(req: Request) {
    const ref = String(req.headers.referer || req.headers.referrer || "");
    if (!ref) return "";
    try {
        return new URL(ref).hostname.replace(/^www\./, "");
    } catch {
        return "";
    }
}

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

        const published = await PublishedPage.findOne({
            author: authorId,
            name: pageName,
        }).lean<IPublishedPage>();

        if (!published) {
            return res.status(404).json({ error: "published_page_not_found" });
        }

        const page = await Page.findOne({ author: authorId, name: pageName }).lean();
        const viewedAt = new Date();

        PageView.create({
            pageName,
            pageId: page?._id,
            author: authorId,
            day: toISODate(startOfDay(viewedAt)),
            viewedAt,
            visitorHash: getVisitorHash(req),
            referrer: normalizeReferrer(req),
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

export default router;
