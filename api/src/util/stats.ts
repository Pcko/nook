type PageViewEvent = {
    day: string;
    visitorHash?: string;
    viewedAt?: Date;
    referrer?: string;
    pageName?: string;
    _id?: unknown;
};

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

function getRange(query: { rangeDays?: unknown; dateFrom?: unknown; dateTo?: unknown }) {
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
    const trimmed = ref.trim();
    if (!trimmed) return "Direct";
    if (trimmed.toLowerCase() === "direct") return "Direct";
    try {
        const host = new URL(trimmed).hostname.replace(/^www\./, "");
        return host || "Direct";
    } catch {
        try {
            const host = new URL(`https://${trimmed}`).hostname.replace(/^www\./, "");
            return host || "Direct";
        } catch {
            return "Direct";
        }
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

function computeStats(events: PageViewEvent[], dateFrom: string, rangeDays: number, segment: string) {
    const dayList = buildDateList(dateFrom, rangeDays);
    const dayIndex = new Map<string, number>();
    const series = dayList.map((day, index) => {
        dayIndex.set(day, index);
        return { date: day, views: 0, unique: 0 };
    });
    const perDayUnique = dayList.map(() => new Set<string>());

    const visitorStats = new Map<string, { firstViewedAt: Date }>();

    for (const event of events) {
        const visitorKey = event.visitorHash || `anon-${event._id}`;
        const viewedAt = event.viewedAt ? new Date(event.viewedAt) : new Date(`${event.day}T00:00:00`);
        const current = visitorStats.get(visitorKey);
        if (!current || viewedAt < current.firstViewedAt) {
            visitorStats.set(visitorKey, { firstViewedAt: viewedAt });
        }
    }

    const uniqueVisitors = new Set<string>();
    const referrerCounts = new Map<string, number>();

    for (const event of events) {
        const visitorKey = event.visitorHash || `anon-${event._id}`;
        const viewedAt = event.viewedAt ? new Date(event.viewedAt) : new Date(`${event.day}T00:00:00`);
        const stats = visitorStats.get(visitorKey);
        const isFirst = stats ? viewedAt.getTime() === stats.firstViewedAt.getTime() : true;

        let include = segment === "all";
        if (segment === "new") include = isFirst;
        if (segment === "returning") include = !isFirst;

        if (!include) continue;

        const index = dayIndex.get(event.day);
        if (index === undefined) continue;

        series[index].views += 1;
        perDayUnique[index].add(visitorKey);
        uniqueVisitors.add(visitorKey);

        const referrerName = normalizeReferrer(event.referrer);
        referrerCounts.set(referrerName, (referrerCounts.get(referrerName) || 0) + 1);
    }

    for (let i = 0; i < series.length; i += 1) {
        series[i].unique = perDayUnique[i].size;
    }

    const totalViews = series.reduce((sum, row) => sum + row.views, 0);

    return {
        summary: {
            views: totalViews,
            uniqueVisitors: uniqueVisitors.size,
            avgDailyViews: rangeDays ? Math.round(totalViews / rangeDays) : 0,
        },
        series,
        referrerCounts,
    };
}

function buildTopList(map: Map<string, number>, limit = 5, keyName = "name", valueName = "visits") {
    return Array.from(map.entries())
        .map(([key, value]) => ({ [keyName]: key, [valueName]: value }))
        .sort((a: any, b: any) => b[valueName] - a[valueName])
        .slice(0, limit);
}

export {
    DEFAULT_RANGE_DAYS,
    VALID_SEGMENTS,
    startOfDay,
    toISODate,
    addDays,
    parseDate,
    getRange,
    getPreviousRange,
    calculateChange,
    normalizeReferrer,
    buildDateList,
    computeStats,
    buildTopList,
};
