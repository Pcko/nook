/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file AIChangeReviewPopup.tsx
 *
 * Modal dialog for reviewing and selectively applying AI-generated changes.
 *
 * Features:
 * - Lists AI changes with per-change enable/disable checkbox
 * - "Select all" / "Select none" helpers
 * - Single large preview (After-selected) to maximize viewing area
 *
 * Preview strategy:
 * - Creates a hidden, minimal GrapesJS editor instance (offscreen)
 * - Loads the base project data into the preview editor
 * - Reloads base data, applies enabled changes, then renders HTML/CSS
 * - If `focusTargetId` is provided, the preview tries to scope HTML/CSS to that component
 *
 * Important:
 * - The preview editor is isolated from the main editor (no side effects).
 * - Different GrapesJS versions may expose different APIs (e.g. loadProjectData, getHtml/getCss scoping).
 */

import React, {JSX, useEffect, useMemo, useRef, useState} from "react";
import grapesjs from "grapesjs";
import {AnimatePresence, motion} from "framer-motion";
import {CheckIcon, XMarkIcon} from "@heroicons/react/24/solid";

import {applyAIChanges, findAIChangeTarget} from "./AIAssistantUtils.ts";
import {AIChangeReviewModalProps} from "./types.ts";
import ControlButton from "./ControlButton.tsx";
import PrimaryButton from "./PrimaryButton.tsx";
import DangerButton from "./DangerButton.tsx";

/**
 * Builds a minimal HTML document string used as an iframe `srcDoc`.
 *
 * @param html - Body HTML to render.
 * @param css - CSS string to inject.
 * @returns Full HTML document string for iframe srcDoc.
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
  <body>
    ${html || ""}
  </body>
</html>`;
}

/**
 * AIChangeReviewModal
 *
 * Props are defined in `AIChangeReviewModalProps` and typically include:
 * - open: whether the modal is visible
 * - baseProjectData: GrapesJS project snapshot (used for preview rendering)
 * - focusTargetId: optional id to scope preview to a single element/component
 * - changes: list of reviewable AI changes with `enabled` flags
 * - onChange: callback receiving the updated changes list after toggling
 * - onApply: apply selected changes in the real editor
 * - onReject: close modal without applying changes
 *
 * @param props - Component props.
 * @returns JSX element.
 */
function AIChangeReviewPopup(props: AIChangeReviewModalProps): JSX.Element {
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
     * Tracks which change is clicked (purely for visual highlight in the list).
     * No technical details panel is shown (target audience is non-technical).
     */
    const [activeId, setActiveId] = useState<string | null>(null);

    /** Whether the preview editor has been initialized */
    const [previewReady, setPreviewReady] = useState(false);

    /** The full iframe `srcDoc` content */
    const [previewDoc, setPreviewDoc] = useState<string>("");

    /** Offscreen DOM element used as GrapesJS container */
    const hiddenContainerRef = useRef<HTMLDivElement | null>(null);

    /** Holds the hidden GrapesJS preview editor instance */
    const previewEditorRef = useRef<any>(null);

    /**
     * Number of selected (enabled) changes.
     */
    const enabledCount = useMemo(
        () => changes.filter((c) => c.enabled).length,
        [changes]
    );

    /**
     * When the modal opens, default-select the first change for highlight.
     */
    useEffect(() => {
        if (!open) return;
        if (!activeId && changes.length) setActiveId(changes[0].id);
    }, [open, changes, activeId]);

    /**
     * Initializes the hidden GrapesJS editor used exclusively for preview.
     * Created once when the modal opens, destroyed when it closes.
     */
    useEffect(() => {
        if (!open) return;
        if (!hiddenContainerRef.current) return;
        if (previewEditorRef.current) return;


        const editor = grapesjs.init({
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

    /**
     * Recomputes the preview whenever relevant inputs change:
     * - `baseProjectData` snapshot
     * - `focusTargetId`
     * - `changes` (enabled flags)
     *
     * Rendering steps:
     * 1) load base project
     * 2) apply enabled changes into preview editor
     * 3) render HTML/CSS (scoped if possible)
     * 4) write to iframe via `srcDoc`
     */
    useEffect(() => {
        if (!open || !previewReady) return;

        const editor = previewEditorRef.current;
        if (!editor || !baseProjectData) return;

        /**
         * Loads GrapesJS project data (if the build supports it).
         *
         * @param data - Project data snapshot.
         * @returns True if loaded, false if unsupported.
         */
        const load = (data: any): boolean => {
            if (typeof editor.loadProjectData === "function") {
                editor.loadProjectData(data);
                return true;
            }
            return false;
        };

        if (!load(baseProjectData)) {
            const msg = `<div style="padding:16px;font-family:sans-serif">Preview unavailable (editor.loadProjectData not found).</div>`;
            setPreviewDoc(buildSrcDoc(msg, ""));
            return;
        }

        /**
         * Reads HTML/CSS from the preview editor.
         * If `focusTargetId` is set and the target can be found, attempts component-scoped output.
         *
         * @returns Renderable HTML/CSS.
         */
        const getScopedHtmlCss = (): { html: string; css: string } => {
            const target = focusTargetId ? findAIChangeTarget(editor, focusTargetId) : null;

            // Render full page if no focus target was provided or found.
            if (!target) return {html: editor.getHtml(), css: editor.getCss()};

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

        // Build the final "After-selected" preview
        load(baseProjectData);
        applyAIChanges(editor, changes);
        const scoped = getScopedHtmlCss();
        setPreviewDoc(buildSrcDoc(scoped.html, scoped.css));
    }, [open, previewReady, baseProjectData, focusTargetId, changes]);

    /**
     * Toggles a single change enabled flag.
     *
     * @param id - AI change id.
     */
    const toggleChange = (id: string): void => {
        const next = changes.map((c) => (c.id === id ? {...c, enabled: !c.enabled} : c));
        onChange(next);
    };

    /**
     * Enables or disables all changes.
     *
     * @param enabled - Whether all changes should be enabled.
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
                        className={[
                            "w-full max-w-6xl overflow-hidden rounded-2xl",
                            "border border-ui-border bg-ui-bg shadow-2xl",
                        ].join(" ")}
                        initial={{opacity: 0, y: 12, scale: 0.985}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: 12, scale: 0.985}}
                        transition={{duration: 0.18}}
                    >
                        {/* Header */}
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

                        {/* Body */}
                        <div className="grid grid-cols-12 gap-0">
                            {/* Change list */}
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

                            {/* Large Preview */}
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
                                        <iframe
                                            title="AI Preview"
                                            className="h-[74vh] w-full bg-white"
                                            sandbox="allow-same-origin"
                                            srcDoc={previewDoc}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hidden container for preview GrapesJS instance */}
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