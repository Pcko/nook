import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Page, PageView, PublishedPage } from "../util/internal.js";
import IPublishedPage from "../types/IPublishedPage.js";
import {
    VALID_SEGMENTS,
    calculateChange,
    computeStats,
    getPreviousRange,
    getRange,
    normalizeReferrer,
    startOfDay,
    toISODate,
    buildTopList,
} from "../util/stats.js";

const router = express.Router();

router.get("/pages/:pageId", async (req: Request, res: Response) => {
    try {
        const { userId } = req;
        const { pageId } = req.params;

        const segmentRaw = String(req.query.segment || "all");
        const segment = VALID_SEGMENTS.has(segmentRaw) ? segmentRaw : "all";

        const { dateFrom, dateTo, rangeDays } = getRange(req.query);
        const previousRange = getPreviousRange(dateFrom, rangeDays);

        let page = await Page.findOne({ author: userId, name: pageId }).lean();
        if (!page && mongoose.isValidObjectId(pageId)) {
            page = await Page.findOne({ _id: pageId, author: userId }).lean();
        }

        if (!page) {
            return res.status(404).json({ error: "page_not_found" });
        }

        const pageName = page.name;

        const events = await PageView.find({
            author: userId,
            pageName,
            day: { $gte: dateFrom, $lte: dateTo },
        })
            .select("day visitorHash viewedAt referrer")
            .lean();

        const previousEvents = await PageView.find({
            author: userId,
            pageName,
            day: { $gte: previousRange.dateFrom, $lte: previousRange.dateTo },
        })
            .select("day visitorHash viewedAt")
            .lean();

        const computed = computeStats(events, dateFrom, rangeDays, segment);
        const previousComputed = computeStats(previousEvents, previousRange.dateFrom, rangeDays, segment);

        const summary = {
            ...computed.summary,
            changePctViews: calculateChange(computed.summary.views, previousComputed.summary.views),
            changePctUnique: calculateChange(
                computed.summary.uniqueVisitors,
                previousComputed.summary.uniqueVisitors
            ),
        };

        const referrerCounts = new Map<string, number>();
        for (const event of computed.filteredEvents) {
            const name = normalizeReferrer(event.referrer);
            referrerCounts.set(name, (referrerCounts.get(name) || 0) + 1);
        }

        const topReferrers = buildTopList(referrerCounts, 5, "name", "visits");

        const authorEvents = await PageView.find({
            author: userId,
            day: { $gte: dateFrom, $lte: dateTo },
        })
            .select("pageName")
            .lean();

        const pageCounts = new Map<string, number>();
        for (const event of authorEvents) {
            const name = event.pageName || "Unknown";
            pageCounts.set(name, (pageCounts.get(name) || 0) + 1);
        }

        const topPages = buildTopList(pageCounts, 5, "path", "views");

        const publishedPage = await PublishedPage.findOne({ author: userId, name: pageName }).lean<IPublishedPage>();
        let deployments: any[] = [];
        
        if (publishedPage) {
            const deploymentDate = toISODate(
                startOfDay(new Date(publishedPage.updatedAt ?? publishedPage.createdAt ?? Date.now()))
            );
            const viewsSinceDeploy = await PageView.countDocuments({
                author: userId,
                pageName,
                day: { $gte: deploymentDate },
            });

            deployments = [
                {
                    id: publishedPage._id,
                    name: "Live Deployment",
                    createdAt: deploymentDate,
                    note: "Published page",
                    viewsSinceDeploy,
                },
            ];
        }

        return res.status(200).json({
            summary,
            series: computed.series,
            topReferrers,
            topPages,
            deployments,
        });
    } catch (err) {
        console.error("❌ Stats error:", err);
        return res.sendStatus(500);
    }
});

export default router;
