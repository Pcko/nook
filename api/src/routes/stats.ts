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
    startOfDay,
    toISODate,
    buildTopList,
} from "../util/stats.js";

const router = express.Router();

async function findPage(userId: string, pageId: string) {
    if (mongoose.isValidObjectId(pageId)) {
        const byId = await Page.findOne({ _id: pageId, author: userId }).lean();
        if (byId) return byId;
    }
    return Page.findOne({ author: userId, name: pageId }).lean();
}

function buildPageFilter(pageName: string, pageId?: unknown) {
    return pageId ? { $or: [{ pageId }, { pageName }] } : { pageName };
}

router.get("/pages/:pageId", async (req: Request, res: Response) => {
    try {
        const { userId } = req;
        const { pageId } = req.params;

        const segmentRaw = String(req.query.segment || "all");
        const segment = VALID_SEGMENTS.has(segmentRaw) ? segmentRaw : "all";

        const { dateFrom, dateTo, rangeDays } = getRange(req.query);
        const previousRange = getPreviousRange(dateFrom, rangeDays);

        const page = await findPage(userId!, pageId);
        if (!page) {
            return res.status(404).json({ error: "page_not_found" });
        }

        const pageName = page.name;
        const pageFilter = buildPageFilter(pageName, page._id);

        const [events, previousEvents, authorEvents, publishedPage] = await Promise.all([
            PageView.find({
                author: userId,
                day: { $gte: dateFrom, $lte: dateTo },
                ...pageFilter,
            })
                .select("day visitorHash viewedAt referrer")
                .lean(),
            PageView.find({
                author: userId,
                day: { $gte: previousRange.dateFrom, $lte: previousRange.dateTo },
                ...pageFilter,
            })
                .select("day visitorHash viewedAt")
                .lean(),
            PageView.find({
                author: userId,
                day: { $gte: dateFrom, $lte: dateTo },
            })
                .select("pageName")
                .lean(),
            PublishedPage.findOne({ author: userId, name: pageName }).lean<IPublishedPage>(),
        ]);

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

        const topReferrers = buildTopList(computed.referrerCounts, 5, "name", "visits");

        const pageCounts = new Map<string, number>();
        for (const event of authorEvents) {
            const name = event.pageName || "Unknown";
            pageCounts.set(name, (pageCounts.get(name) || 0) + 1);
        }

        const topPages = buildTopList(pageCounts, 5, "path", "views");

        let deployments: any[] = [];
        if (publishedPage) {
            const deploymentDate = toISODate(
                startOfDay(new Date(publishedPage.updatedAt ?? publishedPage.createdAt ?? Date.now()))
            );
            const viewsSinceDeploy = await PageView.countDocuments({
                author: userId,
                day: { $gte: deploymentDate },
                ...pageFilter,
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
