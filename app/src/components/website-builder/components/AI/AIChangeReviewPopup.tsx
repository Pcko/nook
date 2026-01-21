/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Modal to review AI-generated GrapesJS changes and preview the result before applying.
 * @module AIChangeReviewModal
 */

import React, {JSX, useEffect, useMemo, useRef, useState} from "react";
import grapesjs, {Editor} from "grapesjs";
import {AnimatePresence, motion} from "framer-motion";
import {CheckIcon, XMarkIcon} from "@heroicons/react/24/solid";

import {applyAIChanges, findAIChangeTarget} from "./AIAssistantUtils.ts";
import {AIChangeReviewPopupProps} from "./types.ts";
import ControlButton from "./ControlButton.tsx";
import PrimaryButton from "./PrimaryButton.tsx";
import DangerButton from "./DangerButton.tsx";

const PREVIEW_SCALE = 0.3;

/**
 * Builds a minimal HTML document string used as an iframe `srcDoc`.
 *
 * @param {string} html - Body HTML to render.
 * @param {string} css - CSS string to inject.
 * @returns {string} Full HTML document string for iframe srcDoc.
 */
function buildSrcDoc(html: string, css: string): string {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${css || ""}</style>
    <style>
      html, body { margin: 0; padding: 0; }
      body { background: #fff; }
    </style>
  </head>
  <body class="scale-50">
    ${html || ""}
  </body>
</html>`;
}

/**
 * Modal to review and selectively apply AI-generated changes.
 *
 * Creates an isolated, hidden GrapesJS editor instance to generate a live preview:
 * - The preview editor loads `baseProjectData`.
 * - Enabled `changes` are applied to that preview editor.
 * - HTML/CSS are rendered into an iframe via `srcDoc`.
 *
 * If `focusTargetId` is set, the preview attempts to scope output to that component.
 *
 * @component
 * @param {AIChangeReviewPopupProps} props - Component props.
 * @returns {JSX.Element} Rendered modal.
 */
function AIChangeReviewPopup(props: AIChangeReviewPopupProps): JSX.Element {
    const {
        open,
        title,
        baseProjectData,
        focusTargetId,
        changes,
        onChange,
        onApply,
        onReject,
    } = props;

    /**
     * Tracks the clicked change for list highlight only.
     * No technical "details" panel is rendered for end-users.
     *
     * @type {[string|null, React.Dispatch<React.SetStateAction<string|null>>]}
     */
    const [activeId, setActiveId] = useState<string | null>(null);

    /**
     * True once the hidden preview editor is initialized.
     *
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [previewReady, setPreviewReady] = useState(false);

    /**
     * Complete iframe `srcDoc` content for the preview.
     *
     * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
     */
    const [previewDoc, setPreviewDoc] = useState<string>("");

    /**
     * Offscreen DOM container used as GrapesJS mount point.
     *
     * @type {React.MutableRefObject<HTMLDivElement|null>}
     */
    const hiddenContainerRef = useRef<HTMLDivElement | null>(null);

    /**
     * Holds the GrapesJS preview editor instance.
     *
     * @type {React.MutableRefObject<any>}
     */
    const previewEditorRef = useRef<any>(null);

    /**
     * Number of currently enabled changes.
     *
     * @type {number}
     */
    const enabledCount = useMemo(() => changes?.filter((c) => c.enabled).length, [changes]);

    useEffect(() => {
        if (!open) return;
        if (!activeId && changes.length) setActiveId(changes[0].id);
    }, [open, changes, activeId]);

    useEffect(() => {
        if (!open) return;
        if (!hiddenContainerRef.current) return;
        if (previewEditorRef.current) return;

        const editor : Editor= grapesjs.init({
            container: hiddenContainerRef.current,
            height: "0px",
            width: "0px",
            fromElement: false,
            storageManager: false,
            panels: {defaults: []},
            selectorsManager: {componentFirst: true},
        });

        previewEditorRef.current = editor;
        setPreviewReady(true);

        return () => {
            try {
                editor.destroy();
            } catch {
                // ignore
            }
            previewEditorRef.current = null;
            setPreviewReady(false);
        };
    }, [open]);

    useEffect(() => {
        if (!open || !previewReady) return;

        const editor = previewEditorRef.current;
        if (!editor || !baseProjectData) return;

        /**
         * Loads project data into the preview editor if supported by the current GrapesJS build.
         *
         * @param {any} data - GrapesJS project data snapshot.
         * @returns {boolean} True when loading succeeded, false otherwise.
         */
        const load = (data: any): boolean => {
            if (typeof editor.loadProjectData === "function") {
                editor.loadProjectData(data);
                return true;
            }
            return false;
        };

        if (!load(baseProjectData)) {
            const msg =
                `<div style="padding:16px;font-family:sans-serif">Preview unavailable (editor.loadProjectData not found).</div>`;
            setPreviewDoc(buildSrcDoc(msg, ""));
            return;
        }

        /**
         * Reads HTML/CSS output from the preview editor.
         * If `focusTargetId` resolves to a component, attempts scoped rendering.
         *
         * @returns {{ html: string, css: string }} HTML/CSS strings for preview.
         */
        const getScopedHtmlCss = (): { html: string; css: string } => {
            const target = focusTargetId ? findAIChangeTarget(editor, focusTargetId) : null;

            if (!target) {
                return {html: editor.getHtml(), css: editor.getCss()};
            }

            try {
                const html =
                    typeof editor.getHtml === "function"
                        ? editor.getHtml({component: target})
                        : (target?.toHTML?.() || editor.getHtml());

                const css =
                    typeof editor.getCss === "function"
                        ? editor.getCss({component: target})
                        : editor.getCss();

                return {html, css};
            } catch {
                return {html: editor.getHtml(), css: editor.getCss()};
            }
        };

        load(baseProjectData);
        applyAIChanges(editor, changes);
        const scoped = getScopedHtmlCss();
        setPreviewDoc(buildSrcDoc(scoped.html, scoped.css));
    }, [open, previewReady, baseProjectData, focusTargetId, changes]);

    /**
     * Toggles a single change enabled flag.
     *
     * @param {string} id - AI change id.
     * @returns {void}
     */
    const toggleChange = (id: string): void => {
        const next = changes.map((c) => (c.id === id ? {...c, enabled: !c.enabled} : c));
        onChange(next);
    };

    /**
     * Enables or disables all changes.
     *
     * @param {boolean} enabled - Whether all changes should be enabled.
     * @returns {void}
     */
    const toggleAll = (enabled: boolean): void => {
        onChange(changes.map((c) => ({...c, enabled})));
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="overlay"
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <motion.div
                        key="modal"
                        className={"w-full max-w-6xl overflow-hidden rounded-2xl border border-ui-border bg-ui-bg shadow-2xl"}
                        initial={{opacity: 0, y: 12, scale: 0.985}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: 12, scale: 0.985}}
                        transition={{duration: 0.18}}
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-ui-border px-5 py-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="m-0 truncate text-base font-semibold text-text">
                                        {title || "Review AI changes"}
                                    </h3>
                                    <span
                                        className="rounded-full border border-ui-border bg-website-bg px-2 py-0.5 text-micro font-mono text-text-subtle">
                                        {enabledCount}/{changes.length} selected
                                    </span>
                                </div>
                                <p className="m-0 mt-1 text-small text-text-subtle">
                                    Choose which changes to apply. The preview updates instantly.
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <ControlButton
                                    label="All"
                                    onClick={() => toggleAll(true)}
                                    icon={<CheckIcon className="h-3.5 w-3.5"/>}
                                />
                                <ControlButton
                                    label="None"
                                    onClick={() => toggleAll(false)}
                                    icon={<XMarkIcon className="h-3.5 w-3.5"/>}
                                />
                                <div className="mx-1 h-8 w-px bg-ui-border"/>
                                <PrimaryButton
                                    label="Apply"
                                    onClick={onApply}
                                    icon={<CheckIcon className="h-4 w-4"/>}
                                />
                                <DangerButton
                                    label="Reject"
                                    onClick={onReject}
                                    icon={<XMarkIcon className="h-4 w-4"/>}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-0">
                            <div className="col-span-3 border-r border-ui-border bg-website-bg">
                                <div className="max-h-[74vh] overflow-y-auto p-3">
                                    <div className="space-y-2">
                                        {changes.map((c) => {
                                            const isActive = c.id === activeId;
                                            return (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => setActiveId(c.id)}
                                                    className={[
                                                        "w-full rounded-xl border p-3 text-left transition",
                                                        isActive
                                                            ? "border-primary bg-primary/5"
                                                            : "border-ui-border bg-ui-bg hover:border-primary/50",
                                                    ].join(" ")}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <input
                                                            type="checkbox"
                                                            className="mt-1 h-4 w-4 accent-primary"
                                                            checked={c.enabled}
                                                            onChange={() => toggleChange(c.id)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <div className="min-w-0">
                                                            <div
                                                                className="truncate text-small font-semibold text-text">
                                                                {c.label}
                                                            </div>
                                                            <div className="mt-1 text-micro text-text-subtle">
                                                                {c.type === "component" ? "Layout" : "Styling"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-9">
                                <div className="p-3">
                                    <div
                                        className="overflow-hidden rounded-2xl border border-ui-border bg-ui-bg shadow-sm">
                                        <div
                                            className="flex items-center justify-between border-b border-ui-border px-4 py-2">
                                            <div className="text-small font-semibold text-text">Preview</div>
                                            <div className="text-micro font-mono text-text-subtle">
                                                updates with selection
                                            </div>
                                        </div>
                                        <div className="w-full h-56 overflow-hidden rounded-lg border bg-gray-50">
                                            <iframe
                                                title={`preview-${k}`}
                                                srcDoc={buildSrcDoc(k.html,k.css)}
                                                sandbox=""
                                                style={{
                                                    width: `${100 / PREVIEW_SCALE}%`,
                                                    height: `${100 / PREVIEW_SCALE}%`,
                                                    transform: `scale(${PREVIEW_SCALE})`,
                                                    transformOrigin: "top left",
                                                    border: "0",
                                                    display: "block",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute left-[-10000px] top-[-10000px]" aria-hidden="true">
                            <div ref={hiddenContainerRef}/>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default AIChangeReviewPopup;
