/* eslint-disable react/jsx-sort-props */
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";

import DeploymentStats from "../deployment/DeploymentStats";
import PageService from "../../services/PageService";
import StatsService from "../../services/StatsService";
import { LoadingBubble } from "../general/LoadingScreen";

function classNames(...xs) {
    return xs.filter(Boolean).join(" ");
}

export default function StatsHub() {
    const [pagePickerOpen, setPagePickerOpen] = useState(false);
    const [pageQuery, setPageQuery] = useState("");

    const [pages, setPages] = useState([]);
    const [selectedPageId, setSelectedPageId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load pages
    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setError("");

                const res = await PageService.getPages();
                const list = Array.isArray(res) ? res : res?.data ?? [];

                if (!alive) return;

                setPages(list);

                const first = list?.[0];
                const firstId = first ? (first.id ?? first._id ?? "") : "";
                setSelectedPageId((prev) => prev || firstId);
            } catch (e) {
                if (!alive) return;
                setError("Could not load pages.");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const selectedPage = useMemo(() => {
        if (!selectedPageId) return null;
        return pages.find((p) => (p.id ?? p._id) === selectedPageId) || null;
    }, [pages, selectedPageId]);

    const selectedPageName = useMemo(() => {
        if (!selectedPage) return "";
        return selectedPage.name ?? selectedPage.title ?? "Untitled";
    }, [selectedPage]);

    const filteredPages = useMemo(() => {
        const q = pageQuery.trim().toLowerCase();
        if (!q) return pages;

        return pages.filter((p) => {
            const name = String(p.name ?? p.title ?? "").toLowerCase();
            const slug = String(p.slug ?? "").toLowerCase();
            return name.includes(q) || slug.includes(q);
        });
    }, [pages, pageQuery]);

    if (loading) {
        return (
            <LoadingBubble
                className="w-full rounded-[8px] bg-website-bg"
                compact
                title="Loading analytics"
                subtitle="Fetching your pages and stats."
            />
        );
    }

    return (
        <div className="rounded-[8px] bg-website-bg border border-ui-border shadow-sm p-4 md:p-5">
            {/* Header */}
            <div className="flex flex-wrap items-start gap-3 border-b-2 border-ui-border pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ChartBarIcon className="h-6 w-6 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className="m-0 font-semibold text-text">Analytics</h4>
                    <p className="m-0 mt-1 text-small text-text-subtle">
                        Track views, visitors, and referrers for a selected page.
                    </p>

                    {selectedPageName ? (
                        <div className="mt-2 text-tiny text-text-subtle">
                            Viewing <span className="text-text font-semibold">{selectedPageName}</span>
                        </div>
                    ) : null}

                    {error ? (
                        <div className="mt-2 rounded-[6px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text">
                            {error}
                        </div>
                    ) : null}
                </div>

                <button
                    type="button"
                    className="ml-auto rounded-[6px] border-2 border-ui-border bg-website-bg px-3 pt-1 pb-[6px] text-small
                     text-text-subtle hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-2"
                    onClick={() => setPagePickerOpen(true)}
                    disabled={!pages.length}
                >
                    <span className="max-w-[220px] truncate">
                        {selectedPageName || "Select a page"}
                    </span>
                    <ChevronDownIcon className="h-5 w-5" />
                </button>
            </div>

            {/* Content */}
            <div className="mt-4">
                {selectedPage ? (
                    <DeploymentStats
                        pageId={selectedPageId}
                        fetchStats={(params) => StatsService.getPageStats(params)}
                        variant="embedded"
                    />
                ) : (
                    <div className="rounded-[8px] border-2 border-ui-border bg-ui-bg p-3 text-small text-text-subtle">
                        {pages.length ? "Choose a page to view analytics." : "No pages available yet."}
                    </div>
                )}
            </div>

            {/* Page picker modal */}
            <Transition show={pagePickerOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[70]" onClose={() => setPagePickerOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-150" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-150" enterFrom="opacity-0 translate-y-1 scale-95" enterTo="opacity-100 translate-y-0 scale-100" leave="ease-in duration-100" leaveFrom="opacity-100 translate-y-0 scale-100" leaveTo="opacity-0 translate-y-1 scale-95">
                                <Dialog.Panel className="w-full max-w-lg rounded-[8px] bg-website-bg border border-ui-border shadow-sm p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-primary" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <Dialog.Title className="text-small font-semibold text-text">
                                                Choose a page
                                            </Dialog.Title>
                                            <p className="text-small text-text-subtle mt-1 mb-0">
                                                Search or select a page
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="hover:text-primary transition-colors"
                                            onClick={() => setPagePickerOpen(false)}
                                            aria-label="Close"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="mt-3">
                                        <input
                                            className="w-full h-[44px] px-3 pt-1 border-2 border-ui-border rounded-[6px] bg-website-bg text-small text-text placeholder-text-subtle
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                            placeholder="Search pages…"
                                            value={pageQuery}
                                            onChange={(e) => setPageQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-3 max-h-[320px] overflow-auto rounded-[8px] border-2 border-ui-border bg-ui-bg">
                                        {filteredPages.length ? (
                                            filteredPages.map((p) => {
                                                const pid = p.id ?? p._id;
                                                const name = p.name ?? p.title ?? "Untitled";
                                                const active = pid === selectedPageId;

                                                return (
                                                    <button
                                                        key={pid}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedPageId(pid);
                                                            setPagePickerOpen(false);
                                                        }}
                                                        className={classNames(
                                                            "w-full text-left px-3 py-3 border-b border-ui-border transition-colors",
                                                            active ? "bg-ui-bg-selected" : "hover:bg-website-bg"
                                                        )}
                                                    >
                                                        <div className="text-small font-semibold text-text truncate">
                                                            {name}
                                                        </div>
                                                        <div className="text-tiny text-text-subtle truncate">
                                                            {p.slug ? `/${p.slug}` : pid}
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <div className="px-3 py-4 text-small text-text-subtle">
                                                No pages found.
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            className="rounded-[6px] border-2 border-ui-border bg-website-bg px-3 pt-1 pb-[6px] text-small
                                 text-text-subtle hover:border-primary hover:text-primary transition-colors"
                                            onClick={() => setPagePickerOpen(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
