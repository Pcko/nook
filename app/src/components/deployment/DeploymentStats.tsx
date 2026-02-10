/* eslint-disable react/jsx-sort-props */
import React, { useEffect, useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    ArrowPathIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    EyeIcon,
    GlobeAltIcon,
    LinkIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";

function formatNumber(n) {
    if (n == null || Number.isNaN(Number(n))) return "—";
    return new Intl.NumberFormat().format(Number(n));
}

function formatPct(n) {
    if (n == null || Number.isNaN(Number(n))) return "—";
    const v = Number(n);
    const sign = v > 0 ? "+" : "";
    return `${sign}${v.toFixed(1)}%`;
}

const PRIMARY_COLOR = "var(--primary)";
const PRIMARY_SOFT = "var(--primary-hover)";

function startOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
}

function toISODate(d) {
    const x = new Date(d);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const day = String(x.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function safeDateLabel(iso) {
    // expects YYYY-MM-DD
    const [y, m, d] = String(iso).split("-");
    return `${d}.${m}.`;
}

/**
 * DeploymentStats
 *
 * User Story:
 * "Als Seitenbetreiber möchte ich in einer Deployment Statistik sehen,
 *  wie viele Nutzer meine Seite aufrufen, um den Erfolg meiner Deployments
 *  und Änderungen messen und optimieren zu können."
 *
 * Props:
 * - pageId?: string
 * - deploymentId?: string
 * - fetchStats?: (params) => Promise<StatsResponse>
 * - defaultRangeDays?: 7 | 14 | 30
 * - variant?: "standalone" | "embedded"
 *
 * Expected response shape (example):
 * {
 *   summary: { views, uniqueVisitors, avgDailyViews, changePctViews, changePctUnique },
 *   series: [{ date: "2026-01-16", views: 123, unique: 80 }],
 *   topReferrers: [{ name: "google", visits: 120 }],
 *   topPages: [{ path: "/landing", views: 300 }],
 *   deployments: [{ id, name, createdAt, note, viewsSinceDeploy }]
 * }
 */
export default function DeploymentStats({
                                            pageId,
                                            deploymentId,
                                            fetchStats,
                                            defaultRangeDays = 14,
                                            variant = "standalone",
                                        }) {
    const isEmbedded = variant === "embedded";
    const [rangeDays, setRangeDays] = useState(defaultRangeDays);
    const [segment, setSegment] = useState("all");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [stats, setStats] = useState(null);

    const dateTo = useMemo(() => toISODate(startOfDay(new Date())), []);
    const dateFrom = useMemo(() => toISODate(startOfDay(daysAgo(rangeDays - 1))), [rangeDays]);

    // Fallback empty data when no API is provided
    async function defaultFetch() {
        const series = Array.from({ length: rangeDays }, (_, idx) => {
            const d = new Date();
            d.setDate(d.getDate() - (rangeDays - 1 - idx));
            return { date: toISODate(d), views: 0, unique: 0 };
        });

        return {
            summary: {
                views: 0,
                uniqueVisitors: 0,
                avgDailyViews: 0,
                changePctViews: null,
                changePctUnique: null,
            },
            series,
            topReferrers: [],
            topPages: [],
            deployments: [],
        };
    }

    async function load() {
        setLoading(true);
        setError("");

        try {
            const fn = fetchStats || defaultFetch;
            const res = await fn({
                pageId,
                deploymentId,
                dateFrom,
                dateTo,
                rangeDays,
                segment,
            });
            setStats(res);
        } catch (e) {
            setError(e?.message || "Statistiken konnten nicht geladen werden.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageId, deploymentId, rangeDays, segment]);

    const kpis = useMemo(() => {
        const s = stats?.summary || {};
        return [
            {
                label: "Views",
                value: formatNumber(s.views),
                delta: formatPct(s.changePctViews),
                icon: EyeIcon,
            },
            {
                label: "Unique visitors",
                value: formatNumber(s.uniqueVisitors),
                delta: formatPct(s.changePctUnique),
                icon: UsersIcon,
            },
            {
                label: "Avg/day",
                value: formatNumber(s.avgDailyViews),
                delta: "—",
                icon: ChartBarIcon,
            },
        ];
    }, [stats]);

    const series = stats?.series || [];
    const deployments = stats?.deployments || [];
    const topReferrers = stats?.topReferrers || [];
    const topPages = stats?.topPages || [];

    const content = (
        <>
            {!isEmbedded ? (
                <div className="flex items-start gap-3 border-b-2 border-ui-border pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <ChartBarIcon className="h-6 w-6 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h4 className="m-0 font-semibold text-text">Analytics</h4>
                        <p className="m-0 mt-1 text-small text-text-subtle">
                            Understand how deployments affect views and visitors over time.
                        </p>
                    </div>
                </div>
            ) : null}

            <div className={isEmbedded ? "" : "mt-3"}>
                <div className="flex flex-wrap items-center gap-2 text-tiny text-text-subtle">
                    <span className="inline-flex items-center gap-1">
                        <CalendarDaysIcon className="h-4 w-4" />
                        Range: <span className="text-text">{dateFrom}</span> – <span className="text-text">{dateTo}</span>
                    </span>
                    {!isEmbedded && pageId ? (
                        <span className="inline-flex items-center gap-1">
                            <LinkIcon className="h-4 w-4" />
                            Page: <span className="text-text">{pageId}</span>
                        </span>
                    ) : null}
                    {!isEmbedded && deploymentId ? (
                        <span className="inline-flex items-center gap-1">
                            <GlobeAltIcon className="h-4 w-4" />
                            Deployment: <span className="text-text">{deploymentId}</span>
                        </span>
                    ) : null}
                </div>

                {/* Controls */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <PillGroup
                        label="Range"
                        value={String(rangeDays)}
                        onChange={(v) => setRangeDays(Number(v))}
                        options={[
                            { value: "7", label: "7 days" },
                            { value: "14", label: "14 days" },
                            { value: "30", label: "30 days" },
                        ]}
                    />

                    <PillGroup
                        label="Visitors"
                        value={segment}
                        onChange={setSegment}
                        options={[
                            { value: "all", label: "All" },
                            { value: "new", label: "New" },
                            { value: "returning", label: "Returning" },
                        ]}
                    />

                    <div className="ml-auto flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={load}
                            disabled={loading}
                            className={`rounded-[6px] border-2 border-ui-border bg-website-bg px-3 pt-1 pb-[6px] text-small text-text-subtle hover:border-primary hover:text-primary transition-colors ${
                                loading ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                        >
                            <span className="inline-flex items-center gap-2">
                                <ArrowPathIcon className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                                Refresh
                            </span>
                        </button>

                        {error ? (
                            <div className="rounded-[6px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text">
                                {error}
                            </div>
                        ) : null}

                        {loading ? (
                            <div className="rounded-[6px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text-subtle">
                                Loading…
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* KPIs */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {kpis.map((k) => (
                        <KpiCard key={k.label} label={k.label} value={k.value} delta={k.delta} Icon={k.icon} />
                    ))}
                </div>

                {/* Chart */}
                <div className="mt-3 rounded-[8px] border-2 border-ui-border bg-ui-bg p-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="text-small font-semibold text-text">Trend</div>
                        <div className="text-tiny text-text-subtle">Views & unique visitors</div>
                    </div>

                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={series} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.35} />
                                        <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0.05} />
                                    </linearGradient>
                                    <linearGradient id="uniqueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PRIMARY_SOFT} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={PRIMARY_SOFT} stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(v) => safeDateLabel(v)}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value, name) => [
                                        formatNumber(value),
                                        name === "views" ? "Views" : "Unique visitors",
                                    ]}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke={PRIMARY_COLOR}
                                    fill="url(#viewsGradient)"
                                    fillOpacity={1}
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="unique"
                                    stroke={PRIMARY_SOFT}
                                    fill="url(#uniqueGradient)"
                                    fillOpacity={1}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <SimpleTable
                        title="Top referrers"
                        icon={GlobeAltIcon}
                        rows={topReferrers.map((r) => ({ a: r.name, b: formatNumber(r.visits) }))}
                        colA="Source"
                        colB="Visits"
                        empty="No data yet."
                    />

                    <SimpleTable
                        title="Top pages"
                        icon={LinkIcon}
                        rows={topPages.map((p) => ({ a: p.path, b: formatNumber(p.views) }))}
                        colA="Path"
                        colB="Views"
                        empty="No data yet."
                    />
                </div>

                {/* Deployments */}
                <div className="mt-3 rounded-[8px] border-2 border-ui-border bg-ui-bg p-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="text-small font-semibold text-text">Deployments</div>
                        <div className="text-tiny text-text-subtle">Views since deployment</div>
                    </div>

                    <div className="mt-2 overflow-x-auto">
                        <table className="w-full text-small">
                            <thead>
                            <tr className="text-text-subtle">
                                <th className="text-left font-semibold py-2 pr-3">Date</th>
                                <th className="text-left font-semibold py-2 pr-3">Name</th>
                                <th className="text-left font-semibold py-2 pr-3">Note</th>
                                <th className="text-right font-semibold py-2">Views</th>
                            </tr>
                            </thead>
                            <tbody>
                            {deployments.length ? (
                                deployments.map((d) => (
                                    <tr key={d.id} className="border-t border-ui-border">
                                        <td className="py-2 pr-3 text-text">{d.createdAt}</td>
                                        <td className="py-2 pr-3 text-text">{d.name}</td>
                                        <td className="py-2 pr-3 text-text-subtle">{d.note || "—"}</td>
                                        <td className="py-2 text-right text-text font-semibold">{formatNumber(d.viewsSinceDeploy)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="border-t border-ui-border">
                                    <td className="py-3 text-text-subtle" colSpan={4}>
                                        No deployments found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-2 text-tiny text-text-subtle">
                        Tip: noticeable spikes after a deployment can highlight changes worth keeping.
                    </div>
                </div>
            </div>
        </>
    );

    if (isEmbedded) {
        return content;
    }

    return (
        <div className="rounded-[8px] bg-website-bg border border-ui-border shadow-sm p-4 md:p-5">
            {content}
        </div>
    );
}

function PillGroup({ label, value, onChange, options }) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-tiny text-text-subtle">{label}:</div>
            <div className="inline-flex rounded-[999px] border border-ui-border bg-website-bg p-1">
                {options.map((o) => {
                    const active = o.value === value;
                    return (
                        <button
                            key={o.value}
                            type="button"
                            onClick={() => onChange(o.value)}
                            className={`px-3 pt-[3px] pb-[2px] text-small rounded-[999px] transition-colors ${
                                active ? "bg-ui-bg-selected text-text font-semibold" : "text-text-subtle hover:text-primary"
                            }`}
                        >
                            {o.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function KpiCard({ label, value, delta, Icon }) {
    const deltaPositive = typeof delta === "string" && delta.startsWith("+");
    const deltaNegative = typeof delta === "string" && delta.startsWith("-");

    return (
        <div className="rounded-[8px] border-2 border-ui-border bg-ui-bg p-3">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="text-tiny text-text-subtle">{label}</div>
                    <div className="mt-1 text-xl font-semibold text-text">{value}</div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
            </div>

            <div className="mt-2">
        <span
            className={`inline-flex rounded-[999px] border px-2 pt-[3px] pb-[2px] text-tiny font-semibold ${
                deltaPositive
                    ? "border-primary/40 bg-primary/5 text-primary"
                    : deltaNegative
                        ? "border-ui-border bg-website-bg text-text"
                        : "border-ui-border bg-website-bg text-text-subtle"
            }`}
        >
          {delta} vs. previous
        </span>
            </div>
        </div>
    );
}

function SimpleTable({ title, icon: Icon, rows, colA, colB, empty }) {
    return (
        <div className="rounded-[8px] border-2 border-ui-border bg-ui-bg p-3">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="text-small font-semibold text-text">{title}</div>
            </div>

            <div className="mt-2 overflow-x-auto">
                <table className="w-full text-small">
                    <thead>
                    <tr className="text-text-subtle">
                        <th className="text-left font-semibold py-2 pr-3">{colA}</th>
                        <th className="text-right font-semibold py-2">{colB}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.length ? (
                        rows.map((r, idx) => (
                            <tr key={`${r.a}-${idx}`} className="border-t border-ui-border">
                                <td className="py-2 pr-3 text-text">{r.a}</td>
                                <td className="py-2 text-right text-text font-semibold">{r.b}</td>
                            </tr>
                        ))
                    ) : (
                        <tr className="border-t border-ui-border">
                            <td className="py-3 text-text-subtle" colSpan={2}>
                                {empty}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
