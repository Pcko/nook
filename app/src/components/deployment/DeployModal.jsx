/* eslint-disable react/jsx-sort-props */
import React, {Fragment, useEffect, useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Dialog, Transition, Disclosure, Switch} from "@headlessui/react";
import {
    ArrowDownTrayIcon,
    CloudArrowUpIcon,
    EyeIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    XMarkIcon,
    LinkIcon,
} from "@heroicons/react/24/outline";

import axiosInstance from "../auth/AxiosInstance";
import useErrorHandler from "../logging/ErrorHandler";
import {useMetaNotify} from "../logging/MetaNotifyHook";
import {useBuilder} from "../website-builder/hooks/UseBuilder";
import {grapesjsExportConfig} from "../website-builder/utils/grapesExportConfig";
import {getWebsiteExportSettings} from "../website-builder/utils/websiteExportSettings";

function classNames(...xs) {
    return xs.filter(Boolean).join(" ");
}

function slugify(input) {
    return (
        String(input || "")
            .trim()
            .toLowerCase()
            .replace(/['"]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80) || "page"
    );
}

async function buildStaticBundle(editor) {
    const htmlFn = grapesjsExportConfig?.root?.["index.html"];
    const cssFn = grapesjsExportConfig?.root?.css?.["style.css"];
    const imgFn = grapesjsExportConfig?.root?.img;

    if (!htmlFn || !cssFn || !imgFn) {
        throw new Error("Export configuration is missing required handlers.");
    }

    const [html, css, imgBinaryMap] = await Promise.all([
        htmlFn(editor),
        Promise.resolve(cssFn(editor)),
        imgFn(editor),
    ]);

    const assets = Object.entries(imgBinaryMap || {}).map(([filename, binary]) => ({
        path: `img/${filename}`,
        base64: btoa(binary),
    }));

    return {
        html,
        css,
        assets,
        projectData: editor.getProjectData(),
        exportSettings: getWebsiteExportSettings(),
    };
}

const DESTINATIONS = [
    {
        value: "live",
        title: "Publish (Live)",
        subtitle: "Visible to everyone",
        icon: CloudArrowUpIcon,
        env: "production",
    },
    {
        value: "preview",
        title: "Preview link",
        subtitle: "For testing / sharing",
        icon: EyeIcon,
        env: "staging",
    },
    {
        value: "download",
        title: "Download file",
        subtitle: "ZIP for your computer",
        icon: ArrowDownTrayIcon,
        env: null,
    },
];

export default function DeployModal({
                                        open,
                                        onClose,
                                        page,
                                        // optional: show a “Go to Settings” button if you wire it from LeftPanel/TopPanel
                                        onOpenSettings,
                                        // optional: shown as URL preview; e.g. https://yourdomain.com
                                        publicBaseUrl,
                                    }) {
    const baseMeta = useMemo(() => ({feature: "builder", component: "DeployModal"}), []);
    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    const {editorRef, aiBusy, setAiBusy, syncWebsiteDataFromEditor} = useBuilder();

    const settings = getWebsiteExportSettings();
    const defaultSlug = useMemo(() => slugify(page?.name || "page"), [page?.name]);

    const [destination, setDestination] = useState("live"); // live | preview | download
    const [slug, setSlug] = useState(defaultSlug);

    // Advanced (hidden by default)
    const [endpoint, setEndpoint] = useState("/api/deploy");
    const [replaceExisting, setReplaceExisting] = useState(true);
    const [includeProjectData, setIncludeProjectData] = useState(true);

    const [busy, setBusy] = useState(false);
    const [resultUrl, setResultUrl] = useState("");

    useEffect(() => {
        if (!open) return;
        setDestination("live");
        setSlug(defaultSlug);
        setResultUrl("");
    }, [open, defaultSlug]);

    const editorReady = !!editorRef?.current;
    const canRun = editorReady && !busy && !aiBusy;

    const urlPreview = useMemo(() => {
        if (!publicBaseUrl) return "";
        const base = String(publicBaseUrl).replace(/\/+$/, "");
        return `${base}/${slug}/`;
    }, [publicBaseUrl, slug]);

    async function downloadZip() {
        const editor = editorRef?.current;
        if (!editor) return;

        try {
            setResultUrl("");
            notify("info", "Preparing ZIP…", {stage: "deploy", mode: "zip"}, "deploy");
            editor.runCommand("gjs-export-zip");
        } catch (err) {
            handleError(err, {
                fallbackMessage: "Could not export ZIP.",
                meta: {stage: "deploy", mode: "zip"},
            });
        }
    }

    async function publishToApi(env) {
        const editor = editorRef?.current;
        if (!editor) return;

        setBusy(true);
        setAiBusy(true);
        setResultUrl("");

        try {
            syncWebsiteDataFromEditor();

            notify("info", "Publishing…", {stage: "deploy", mode: "api", env}, "deploy");

            const bundle = await buildStaticBundle(editor);

            const payload = {
                page: {id: page?.id ?? null, name: page?.name ?? null},
                slug,
                environment: env,
                overwrite: replaceExisting,
                bundle: {
                    html: bundle.html,
                    css: bundle.css,
                    assets: bundle.assets,
                    exportSettings: bundle.exportSettings,
                    projectData: includeProjectData ? bundle.projectData : undefined,
                },
            };

            const res = await axiosInstance.post(endpoint, payload);
            const maybeUrl = res?.data?.url || res?.data?.publicUrl || res?.data?.deployUrl || "";

            setResultUrl(maybeUrl);

            notify(
                "info",
                "Publish complete.",
                {stage: "deploy", mode: "api", env, endpoint, slug, returnedUrl: maybeUrl || null},
                "deploy"
            );
        } catch (err) {
            handleError(err, {
                fallbackMessage: "Publishing failed.",
                meta: {stage: "deploy", mode: "api", endpoint, slug},
            });
        } finally {
            setBusy(false);
            setAiBusy(false);
        }
    }

    async function handlePrimary() {
        if (destination === "download") return downloadZip();
        const def = DESTINATIONS.find(d => d.value === destination);
        return publishToApi(def?.env || "production");
    }

    const primaryLabel =
        busy ? "Working…" : destination === "download" ? "Download ZIP" : "Publish";

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[60]" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 translate-y-2 scale-95" enterTo="opacity-100 translate-y-0 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 translate-y-0 scale-100" leaveTo="opacity-0 translate-y-2 scale-95">
                            <Dialog.Panel className="w-full max-w-2xl">
                                <motion.div
                                    initial={{opacity: 0, y: 10, scale: 0.98}}
                                    animate={{opacity: 1, y: 0, scale: 1}}
                                    exit={{opacity: 0, y: 10, scale: 0.98}}
                                    transition={{duration: 0.2, ease: "easeOut"}}
                                    className="rounded-[8px] bg-website-bg border border-ui-border shadow-sm p-4 md:p-5"
                                >
                                    {/* Header */}
                                    <div className="flex items-center pb-3 border-b-2 border-ui-border mb-4">
                                        <div className="min-w-0">
                                            <Dialog.Title className="font-semibold text-text m-0">Publish</Dialog.Title>
                                            <p className="text-small text-text-subtle m-0 truncate">
                                                {page?.name || "Untitled page"}
                                            </p>
                                        </div>

                                        <div className="ml-auto flex items-center gap-2">
                                            {typeof onOpenSettings === "function" ? (
                                                <button
                                                    type="button"
                                                    className="rounded-[6px] border-2 border-ui-border bg-website-bg px-3 pt-1 pb-[6px] text-small
                                 text-text-subtle hover:border-primary hover:text-primary transition-colors"
                                                    onClick={() => onOpenSettings()}
                                                    disabled={busy}
                                                >
                                                    Open settings
                                                </button>
                                            ) : null}

                                            <button onClick={onClose} className="hover:text-primary transition-colors" aria-label="Close" disabled={busy} type="button">
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Step 1: quick summary */}
                                    <div className="rounded-[8px] border-2 border-ui-border bg-ui-bg p-3">
                                        <div className="text-small font-semibold text-text mb-2">
                                            Check your site info (from the left panel)
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <SummaryRow label="Site title" value={settings?.title || ""} />
                                            <SummaryRow label="Language" value={settings?.language || ""} />
                                            <SummaryRow label="Favicons" value={settings?.lightDataUrl || settings?.darkDataUrl ? "Custom" : "Default"} />
                                            <SummaryRow label="Description" value={settings?.description || ""} wide />
                                        </div>
                                    </div>

                                    {/* Step 2: destination cards */}
                                    <div className="mt-3">
                                        <div className="text-small font-semibold text-text mb-2">Where should it go?</div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {DESTINATIONS.map((d) => (
                                                <DestinationCard
                                                    key={d.value}
                                                    active={destination === d.value}
                                                    onClick={() => setDestination(d.value)}
                                                    title={d.title}
                                                    subtitle={d.subtitle}
                                                    Icon={d.icon}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step 3: address (simple) */}
                                    {destination !== "download" ? (
                                        <div className="mt-3 rounded-[8px] border-2 border-ui-border bg-ui-bg p-3">
                                            <div className="text-small font-semibold text-text mb-2">Page address</div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="sm:col-span-1">
                                                    <label className="text-small text-text-subtle">Web address name</label>
                                                    <input
                                                        className="mt-1 w-full h-[44px] px-3 pt-1 border-2 border-ui-border rounded-[6px] bg-website-bg text-small text-text placeholder-text-subtle
                                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                                        value={slug}
                                                        onChange={(e) => setSlug(e.target.value)}
                                                        placeholder="my-page"
                                                        disabled={destination === "download"}
                                                    />
                                                </div>

                                                <div className="sm:col-span-1">
                                                    <label className="text-small text-text-subtle">Preview</label>
                                                    <div className="mt-1 h-[44px] rounded-[6px] border border-ui-border bg-website-bg px-3 flex items-center gap-2">
                                                        <LinkIcon className="h-4 w-4 text-text-subtle" />
                                                        <div className="text-small text-text-subtle truncate">
                                                            {urlPreview || "Will be shown after publishing"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2 text-small text-text-subtle">
                                                “Publish (Live)” updates the public page. “Preview link” is for testing.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-3 rounded-[8px] border-2 border-ui-border bg-ui-bg p-3">
                                            <div className="text-small text-text-subtle">
                                                Download creates a ZIP with your page files.
                                            </div>
                                        </div>
                                    )}

                                    {/* Advanced (hidden) */}
                                    <div className="mt-3">
                                        <Disclosure>
                                            {({open: advOpen}) => (
                                                <div className="rounded-[8px] border-2 border-ui-border bg-ui-bg">
                                                    <Disclosure.Button className="w-full px-3 py-3 flex items-center justify-between text-left">
                                                        <div className="text-small font-semibold text-text">Advanced</div>
                                                        <ChevronDownIcon className={classNames("h-5 w-5 text-text-subtle transition-transform", advOpen ? "rotate-180" : "")} />
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="px-3 pb-3">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div>
                                                                <div className="text-small font-medium text-text">Replace existing version</div>
                                                                <div className="mt-1">
                                                                    <Toggle checked={replaceExisting} onChange={setReplaceExisting} />
                                                                </div>
                                                                <div className="mt-1 text-tiny text-text-subtle">If off, publishing can fail if it already exists.</div>
                                                            </div>

                                                            <div>
                                                                <div className="text-small font-medium text-text">Include editor data</div>
                                                                <div className="mt-1">
                                                                    <Toggle checked={includeProjectData} onChange={setIncludeProjectData} />
                                                                </div>
                                                                <div className="mt-1 text-tiny text-text-subtle">Useful for re-importing later.</div>
                                                            </div>

                                                            <div className="sm:col-span-2">
                                                                <div className="text-small font-medium text-text">Deploy endpoint</div>
                                                                <input
                                                                    className={classNames(
                                                                        "mt-1 w-full h-[44px] px-3 pt-1 border-2 border-ui-border rounded-[6px] bg-website-bg text-small text-text placeholder-text-subtle",
                                                                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
                                                                        destination === "download" ? "opacity-60 cursor-not-allowed" : ""
                                                                    )}
                                                                    value={endpoint}
                                                                    onChange={(e) => setEndpoint(e.target.value)}
                                                                    placeholder="/api/deploy"
                                                                    disabled={destination === "download"}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Disclosure.Panel>
                                                </div>
                                            )}
                                        </Disclosure>
                                    </div>

                                    {/* Result */}
                                    <AnimatePresence>
                                        {resultUrl ? (
                                            <motion.div
                                                initial={{opacity: 0, y: 6}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: 6}}
                                                transition={{duration: 0.2}}
                                                className="mt-3 rounded-[8px] border-2 border-ui-border bg-ui-bg p-3"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <CheckCircleIcon className="h-5 w-5 text-primary mt-[2px]" />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-small font-semibold text-text">Done</div>
                                                        <div className="mt-1 flex items-center gap-2 min-w-0">
                                                            <LinkIcon className="h-4 w-4 text-text-subtle" />
                                                            <div className="text-small text-text break-all font-mono">{resultUrl}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className="rounded-[6px] border-2 border-ui-border bg-website-bg px-3 pt-1 pb-[6px] text-small
                                     text-text-subtle hover:border-primary hover:text-primary transition-colors"
                                                            onClick={() => navigator.clipboard.writeText(resultUrl)}
                                                        >
                                                            Copy
                                                        </button>
                                                        <a
                                                            className="rounded-[6px] border-2 border-ui-border bg-website-bg px-3 pt-1 pb-[6px] text-small
                                     text-text-subtle hover:border-primary hover:text-primary transition-colors"
                                                            href={resultUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            Open
                                                        </a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>

                                    {/* Footer */}
                                    <div className="mt-5 flex items-center justify-between gap-2">
                                        <div className="text-tiny text-text-subtle">
                                            {editorReady ? null : "Editor not ready."} {aiBusy ? "AI is busy." : null}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                className="rounded-[6px] border-2 border-ui-border bg-website-bg px-4 pt-2 pb-[9px] text-small
                               text-text-subtle hover:border-primary hover:text-primary transition-colors"
                                                onClick={onClose}
                                                disabled={busy}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                className={classNames(
                                                    "rounded-[6px] px-4 pt-2 pb-[9px] text-small font-semibold transition-colors",
                                                    canRun
                                                        ? "bg-primary text-white hover:opacity-95"
                                                        : "bg-ui-bg-selected text-text-subtle opacity-60 cursor-not-allowed"
                                                )}
                                                onClick={handlePrimary}
                                                disabled={!canRun}
                                            >
                                                {primaryLabel}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

function DestinationCard({active, onClick, title, subtitle, Icon}) {
    return (
        <motion.div
            whileHover={{y: -2}}
            whileTap={{scale: 0.98}}
            onClick={onClick}
            className={classNames(
                "p-4 border-2 rounded-[6px] cursor-pointer bg-website-bg transition-colors",
                active ? "border-primary shadow-sm" : "border-ui-border hover:border-primary hover:shadow-md"
            )}
            role="button"
            tabIndex={0}
        >
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                    <div className="text-small font-semibold text-text">{title}</div>
                    <div className="text-small text-text-subtle">{subtitle}</div>
                </div>
            </div>

            {active ? (
                <div className="mt-3 inline-flex rounded-[999px] border border-primary/40 bg-primary/5 px-2 pt-[3px] pb-[2px] text-tiny font-semibold text-primary">
                    Selected
                </div>
            ) : null}
        </motion.div>
    );
}

function SummaryRow({label, value, wide = false}) {
    return (
        <div className={classNames("rounded-[6px] border border-ui-border bg-website-bg p-2", wide ? "sm:col-span-2" : "")}>
            <div className="text-tiny text-text-subtle">{label}</div>
            <div className="text-small text-text break-words">{value || "—"}</div>
        </div>
    );
}

function Toggle({checked, onChange}) {
    return (
        <Switch
            checked={checked}
            onChange={onChange}
            className={classNames(
                "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors cursor-pointer",
                checked ? "bg-primary/20 border-primary/40" : "bg-ui-bg border-ui-border"
            )}
        >
      <span
          className={classNames(
              "inline-block h-5 w-5 transform rounded-full bg-website-bg border border-ui-border transition-transform",
              checked ? "translate-x-5" : "translate-x-1"
          )}
      />
        </Switch>
    );
}
