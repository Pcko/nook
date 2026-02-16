import React, {useEffect, useMemo, useState} from "react";
import PageService from "../../../services/PageService.ts";
import PublishedPage from "../../../services/interfaces/PublishedPage.ts";
import {LoadingBubble} from "../../general/LoadingScreen";
import Preview from "../../general/Preview.tsx";
import useErrorHandler from "../../logging/ErrorHandler.ts";
import {ArrowPathIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import SortMenu from "./ui/SortMenu";
import {
    buildPreviewDocument,
    getPublicUrl,
    mapLimit,
    pageKey,
    PREVIEW_CONCURRENCY,
    toDate,
} from "./utils/pageExplorerUtils.ts";

type SortKey = "updatedAt" | "createdAt" | "name";

type SortOption = {
    id: SortKey;
    option: string;
    svg: string;
};

const sortByOptions: SortOption[] = [
    {
        id: "name",
        option: "Name",
        svg: "m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
    },
    {
        id: "createdAt",
        option: "Created",
        svg: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    },
    {
        id: "updatedAt",
        option: "Last updated",
        svg: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    }
];

export default function PageExplorer() {
    const [internalPages, setInternalPages] = useState<PublishedPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [sortByOption, setSortByOption] = useState<SortOption>(sortByOptions[0]);

    const [htmlByKey, setHtmlByKey] = useState<Record<string, string>>({});
    const [htmlErrorByKey, setHtmlErrorByKey] = useState<Record<string, string>>({});
    const [htmlLoadingKeys, setHtmlLoadingKeys] = useState<Set<string>>(new Set());

    const handleError = useErrorHandler({feature: "PageExplorer", component: "PageExplorer"});

    const initPages = async () => {
        setLoading(true);
        setError(null);
        try {
            const loaded = await PageService.getPublishedPages();
            setInternalPages(Array.isArray(loaded) ? loaded : []);
        } catch (e: any) {
            setError(e?.message ?? "Failed to load pages");
            handleError(e);
            setInternalPages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void initPages();
    }, []);

    const pages = useMemo(() => {
        const q = search.trim().toLowerCase();

        const filtered = q
            ? internalPages.filter((p) => {
                const name = (p.name ?? "").toLowerCase();
                const author = (p.author ?? "").toLowerCase();
                return name.includes(q) || author.includes(q);
            })
            : internalPages;

        return [...filtered].sort((a, b) => {
            if (sortByOption.id === "name") return (a.name ?? "").localeCompare(b.name ?? "");
            const ad = sortByOption.id === "createdAt" ? toDate(a.createdAt) : toDate(a.updatedAt);
            const bd = sortByOption.id === "createdAt" ? toDate(b.createdAt) : toDate(b.updatedAt);
            return (bd?.getTime() ?? 0) - (ad?.getTime() ?? 0);
        });
    }, [internalPages, search, sortByOption]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            const needs = pages.filter((p) => {
                const k = pageKey(p);
                if (htmlByKey[k]) return false;
                if (htmlErrorByKey[k]) return false;
                return Boolean(p.html);
            });

            if (needs.length === 0) return;

            setHtmlLoadingKeys((prev) => {
                const next = new Set(prev);
                needs.forEach((p) => next.add(pageKey(p)));
                return next;
            });

            await mapLimit(needs, PREVIEW_CONCURRENCY, async (p) => {
                const k = pageKey(p);
                try {
                    if (!p.html) {
                        if (!cancelled) {
                            setHtmlErrorByKey((prev) => ({
                                ...prev,
                                [k]: "No HTML available for preview",
                            }));
                        }
                        return;
                    }

                    const doc = buildPreviewDocument(p.html);

                    if (!cancelled) setHtmlByKey((prev) => ({...prev, [k]: doc}));
                } catch (e: any) {
                    if (!cancelled) {
                        setHtmlErrorByKey((prev) => ({
                            ...prev,
                            [k]: e?.message ?? "Failed to render preview",
                        }));
                    }
                } finally {
                    if (!cancelled) {
                        setHtmlLoadingKeys((prev) => {
                            const next = new Set(prev);
                            next.delete(k);
                            return next;
                        });
                    }
                }
            });
        };

        void run();
        return () => {
            cancelled = true;
        };
    }, [pages, htmlByKey, htmlErrorByKey]);

    return (
        <div className="w-full h-full flex flex-col gap-6 pt-6 px-6 md:px-10 lg:px-16">
            <div ref={sandboxRef} style={{display: "none"}}/>

            <div className="rounded-2xl border border-ui-border bg-ui-bg px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-text">Published Pages</h1>
                        </div>
                        <p className="text-sm text-text-subtle">Browse and open published pages.</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={initPages}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-ui-border bg-website-bg text-sm hover:opacity-80"
                            disabled={loading}
                            type="button"
                        >
                            <ArrowPathIcon className="h-4 w-4"/>
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon
                                className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle"/>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or author..."
                                className="w-full pl-9 pr-3 py-2.5 rounded-[5px] border border-ui-border bg-website-bg text-sm focus:outline-none focus:ring-1 focus:ring-ui-border"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <SortMenu
                            value={sortByOption}
                            onChange={setSortByOption}
                            options={sortByOptions}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-lg border border-dangerous bg-dangerous text-dangerous">
                    {error}
                </div>
            )}

            <div>
                {loading ? (
                    <LoadingBubble/>
                ) : pages.length === 0 ? (
                    <div className="p-6 rounded-xl border border-ui-border bg-ui-bg text-text-subtle">
                        No published pages found.
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {pages.map((p) => {
                            const k = pageKey(p);
                            const publicUrl = getPublicUrl(p);
                            const iframeDoc = htmlByKey[k];
                            const isHtmlLoading = htmlLoadingKeys.has(k);
                            const iframeErr = htmlErrorByKey[k];

                            return (
                                <div
                                    key={k}
                                    className="group rounded-xl border border-ui-border bg-ui-bg p-4 flex flex-col gap-3 transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <Preview
                                        k={k}
                                        iframeDoc={iframeDoc}
                                        isHtmlLoading={isHtmlLoading}
                                        iframeErr={iframeErr}
                                        onClick={() => window.open(publicUrl, "_blank", "noopener,noreferrer")}
                                    />
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="font-semibold truncate text-text">{p.name}</div>
                                            <div className="text-sm text-text-subtle truncate">by {p.author}</div>
                                        </div>
                                        <button
                                            onClick={() => window.open(publicUrl, "_blank", "noopener,noreferrer")}
                                            className="text-xs px-2.5 py-1.5 rounded-md border border-ui-border bg-website-bg text-text-subtle hover:text-text"
                                            type="button"
                                        >
                                            Open
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
