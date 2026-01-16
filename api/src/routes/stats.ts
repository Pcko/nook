import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Page, PageView, PublishedPage } from "../util/internal.js";
import IPublishedPage from "../types/IPublishedPage.js";

const router = express.Router();

const DEFAULT_RANGE_DAYS = 14;
const VALID_SEGMENTS = new Set(["all", "new", "returning"]);

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

function addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function parseDate(value?: string) {
    if (!value) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const d = new Date(`${value}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return value;
}

function getRange(query: Request["query"]) {
    const rangeDaysRaw = Number(query.rangeDays ?? DEFAULT_RANGE_DAYS);
    const rangeDays = Number.isFinite(rangeDaysRaw) && rangeDaysRaw > 0 ? rangeDaysRaw : DEFAULT_RANGE_DAYS;

    const rawFrom = parseDate(query.dateFrom as string | undefined);
    const rawTo = parseDate(query.dateTo as string | undefined);

    if (rawFrom && rawTo) {
        const fromDate = startOfDay(new Date(`${rawFrom}T00:00:00`));
        const toDate = startOfDay(new Date(`${rawTo}T00:00:00`));
        const diffDays = Math.round((toDate.getTime() - fromDate.getTime()) / 86400000) + 1;
        return {
            dateFrom: rawFrom,
            dateTo: rawTo,
            rangeDays: diffDays > 0 ? diffDays : rangeDays,
        };
    }

    const today = startOfDay(new Date());
    const dateTo = toISODate(today);
    const dateFrom = toISODate(addDays(today, -(rangeDays - 1)));

    return { dateFrom, dateTo, rangeDays };
}

function getPreviousRange(dateFrom: string, rangeDays: number) {
    const from = startOfDay(new Date(`${dateFrom}T00:00:00`));
    const prevTo = addDays(from, -1);
    const prevFrom = addDays(prevTo, -(rangeDays - 1));
    return {
        dateFrom: toISODate(prevFrom),
        dateTo: toISODate(prevTo),
    };
}

function calculateChange(current: number, previous: number) {
    if (!previous) return null;
    return Number((((current - previous) / previous) * 100).toFixed(1));
}

function normalizeReferrer(ref?: string) {
    if (!ref) return "Direct";
    try {
        const host = new URL(ref).hostname.replace(/^www\./, "");
        return host || "Direct";
    } catch {
        return "Direct";
    }
}

function buildDateList(dateFrom: string, rangeDays: number) {
    const days: string[] = [];
    const from = startOfDay(new Date(`${dateFrom}T00:00:00`));
    for (let i = 0; i < rangeDays; i += 1) {
        days.push(toISODate(addDays(from, i)));
    }
    return days;
}

function computeStats(events: any[], dateFrom: string, rangeDays: number, segment: string) {
    const dayList = buildDateList(dateFrom, rangeDays);
    const perDayViews = new Map<string, number>();
    const perDayUnique = new Map<string, Set<string>>();

    dayList.forEach((day) => {
        perDayViews.set(day, 0);
        perDayUnique.set(day, new Set());
    });

    const visitorStats = new Map<string, { count: number; firstViewedAt: Date }>();

    for (const event of events) {
        const visitorKey = event.visitorHash || `anon-${event._id}`;
        const viewedAt = event.viewedAt ? new Date(event.viewedAt) : new Date(`${event.day}T00:00:00`);
        const current = visitorStats.get(visitorKey);
        if (!current) {
            visitorStats.set(visitorKey, { count: 1, firstViewedAt: viewedAt });
        } else {
            current.count += 1;
            if (viewedAt < current.firstViewedAt) current.firstViewedAt = viewedAt;
        }
    }

    const uniqueVisitors = new Set<string>();
    const filteredEvents: any[] = [];

    for (const event of events) {
        const visitorKey = event.visitorHash || `anon-${event._id}`;
        const viewedAt = event.viewedAt ? new Date(event.viewedAt) : new Date(`${event.day}T00:00:00`);
        const stats = visitorStats.get(visitorKey);
        const isFirst = stats ? viewedAt.getTime() === stats.firstViewedAt.getTime() : true;

        let include = segment === "all";
        if (segment === "new") include = isFirst;
        if (segment === "returning") include = !isFirst;

        if (!include) continue;

        filteredEvents.push(event);

        perDayViews.set(event.day, (perDayViews.get(event.day) || 0) + 1);
        perDayUnique.get(event.day)?.add(visitorKey);
        uniqueVisitors.add(visitorKey);
    }

    const series = dayList.map((day) => ({
        date: day,
        views: perDayViews.get(day) || 0,
        unique: perDayUnique.get(day)?.size || 0,
    }));

    const totalViews = series.reduce((sum, row) => sum + row.views, 0);

    return {
        summary: {
            views: totalViews,
            uniqueVisitors: uniqueVisitors.size,
            avgDailyViews: rangeDays ? Math.round(totalViews / rangeDays) : 0,
        },
        series,
        filteredEvents,
    };
}

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

        const topReferrers = Array.from(referrerCounts.entries())
            .map(([name, visits]) => ({ name, visits }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 5);

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

        const topPages = Array.from(pageCounts.entries())
            .map(([path, views]) => ({ path, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);

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
