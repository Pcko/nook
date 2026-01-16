/* eslint-disable react/jsx-sort-props */
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";
import React, {useMemo, useState} from "react";
import {
    AiOutlineBorder,
    AiOutlineEye,
    AiOutlineLaptop,
    AiOutlineMobile,
    AiOutlinePlus,
    AiOutlineRedo,
    AiOutlineTablet,
    AiOutlineUndo,
} from "react-icons/ai";

import WebsiteBuilderService from "../../../../services/WebsiteBuilderService";
import DeployModal from "../../../deployment/DeployModal";
import useErrorHandler from "../../../logging/ErrorHandler";
import {useMetaNotify} from "../../../logging/MetaNotifyHook";
import {
    exportWebsite,
    handleRedo,
    handleUndo,
    setDesktop,
    setMobile,
    setTablet,
    toggleOutlines,
    togglePreview,
} from "../../utils/grapesActions";

/**
 * TopPanel
 * Toolbar / command bar for the website builder editor.
 *
 * Responsibilities
 * - Expose common editor actions (undo/redo, outlines, preview)
 * - Switch device viewport (desktop/tablet/mobile/custom width)
 * - Set canvas zoom
 * - Save, export, publish the currently selected page
 *
 * Props
 * @param {Object} props
 * @param {React.MutableRefObject} props.editorRef - GrapesJS editor ref (must be set)
 * @param {Object} props.page - Current page object (used for save/publish)
 */
function TopPanel({editorRef, page}) {
    /**
     * Public base URL for the preview link shown in DeployModal.
     * Note: this should be a full base URL or domain; DeployModal appends `/${slug}/`.
     */
    const PUBLIC_BASE_URL = "nook-app-psi.vercel.app";

    /**
     * Logging/notifications context.
     */
    const baseMeta = useMemo(
        () => ({
            feature: "builder",
            component: "TopPanel",
        }),
        []
    );

    const {notify} = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    /**
     * Persist the current editor state to the backend.
     * Uses WebsiteBuilderService.savePageState(editor, page).
     */
    function handleSave() {
        WebsiteBuilderService.savePageState(editorRef.current, page)
            .then(() => {
                notify(
                    "info",
                    "Page was saved successfully.",
                    {stage: "page-save", pageName: page.name},
                    "submit"
                );
            })
            .catch((err) => {
                handleError(err, {
                    fallbackMessage: "Failed to save the page.",
                    meta: {stage: "page-save", pageName: page?.name ?? null},
                });
            });
    }

    /**
     * Canvas zoom percentage (used for display + highlighting).
     */
    const [zoom, setZoom] = useState(100);

    /**
     * Publish modal open/close state.
     */
    const [deployOpen, setDeployOpen] = useState(false);

    /**
     * Custom device viewport width input state (string typed by user).
     */
    const [customViewport, setCustomViewport] = useState("");

    /**
     * Show/hide the custom viewport width input field.
     */
    const [showCustomViewport, setShowCustomViewport] = useState(false);

    /**
     * Stores last successfully applied custom width, so the "+" button can restore it quickly.
     */
    const [lastAppliedCustomWidth, setLastAppliedCustomWidth] = useState(null);

    /**
     * Set GrapesJS canvas zoom and compensate the iframe height so content stays visible.
     * @param {number} val - Zoom percentage (e.g. 25, 50, 75, 100)
     */
    const setCanvasZoom = (val) => {
        const editor = editorRef?.current;
        if (!editor) return;

        editor.Canvas.setZoom(val);
        setZoom(val);

        const frameEl = editor.Canvas.getFrameEl?.();
        const canvasEl = editor.Canvas.getElement?.();
        if (!frameEl || !canvasEl) return;

        // Adjust iframe height inversely to zoom so the page stays within viewport
        const baseHeight = canvasEl.clientHeight || 800;
        const newHeight = baseHeight * (100 / val);
        frameEl.style.height = `${newHeight}px`;
    };

    /**
     * Ensure a "custom" device exists in GrapesJS DeviceManager and set it to the provided width.
     * @param {number} width - width in pixels (e.g. 950)
     */
    const ensureAndSetCustomDevice = (width) => {
        const editor = editorRef?.current;
        if (!editor) return;

        const dm = editor.DeviceManager;
        const id = "custom";
        const widthPx = `${width}px`;

        const existing = dm.get(id);
        if (!existing) {
            dm.add(id, {name: "Custom", width: widthPx});
        } else {
            existing.set("width", widthPx);
        }

        editor.setDevice(id);
    };

    /**
     * Parse the custom viewport input and apply it if valid.
     */
    const applyCustomViewport = () => {
        const raw = String(customViewport).trim();
        const width = parseInt(raw, 10);
        if (!Number.isFinite(width) || width <= 0) return;

        setLastAppliedCustomWidth(width);
        ensureAndSetCustomDevice(width);
    };

    /**
     * Device actions: hide custom input and switch to device presets.
     */
    const handleDesktop = () => {
        setShowCustomViewport(false);
        setDesktop(editorRef);
    };

    const handleTablet = () => {
        setShowCustomViewport(false);
        setTablet(editorRef);
    };

    const handleMobile = () => {
        setShowCustomViewport(false);
        setMobile(editorRef);
    };

    /**
     * "+" behavior:
     * - show the custom viewport input
     * - if user previously applied a custom width, restore that device immediately
     */
    const handlePlus = () => {
        setShowCustomViewport(true);

        if (lastAppliedCustomWidth && Number.isFinite(lastAppliedCustomWidth)) {
            ensureAndSetCustomDevice(lastAppliedCustomWidth);
            if (!customViewport) setCustomViewport(String(lastAppliedCustomWidth));
        }
    };

    return (
        <div
            className="h-12 grid grid-cols-[1fr_auto_1fr] items-center px-4 border border-ui-border bg-ui-bg text-text font-sans gap-2">
            {/* Left group: edit tools */}
            <div className="flex items-center gap-2">
                <ToolbarButton icon={<AiOutlineUndo size={18}/>} label="Str+Z" onClick={() => handleUndo(editorRef)}/>
                <ToolbarButton icon={<AiOutlineRedo size={18}/>} label="Str+Y" onClick={() => handleRedo(editorRef)}/>
                <ToolbarButton icon={<AiOutlineBorder size={18}/>} label="Alt+O"
                               onClick={() => toggleOutlines(editorRef)}/>
                <ToolbarButton icon={<AiOutlineEye size={18}/>} label="Alt+P" onClick={() => togglePreview(editorRef)}/>
            </div>

            {/* Center group: devices + zoom */}
            <div className="flex items-center justify-center gap-2">
                <ToolbarButton icon={<AiOutlinePlus size={18}/>} onClick={handlePlus}/>

                {showCustomViewport && (
                    <CustomViewportInput onApply={applyCustomViewport} onChange={setCustomViewport}
                                         value={customViewport}/>
                )}

                <ToolbarButton icon={<AiOutlineLaptop size={18}/>} onClick={handleDesktop}/>
                <ToolbarButton icon={<AiOutlineTablet size={18}/>} onClick={handleTablet}/>
                <ToolbarButton icon={<AiOutlineMobile size={18}/>} onClick={handleMobile}/>

                <ZoomListbox onChange={(val) => setCanvasZoom(val)} options={[25, 50, 75, 100]} value={zoom}/>
            </div>

            {/* Right group: save/export/publish */}
            <div className="flex items-center justify-end gap-2">
                <TopActionButton label="Save" onClick={handleSave}/>
                <TopActionButton label="Export" onClick={() => exportWebsite(editorRef)}/>
                <TopActionButton label="Publish" onClick={() => setDeployOpen(true)} primary/>
            </div>

            {/* Publish dialog */}
            <DeployModal
                onClose={() => setDeployOpen(false)}
                open={deployOpen}
                page={page}
                publicBaseUrl={PUBLIC_BASE_URL}
            />
        </div>
    );
}

/**
 * CustomViewportInput
 * Small input + "px" apply button used to set a custom device width.
 *
 * Props:
 * @param {string} value - Current input text
 * @param {(value: string) => void} onChange - Updates input state
 * @param {() => void} onApply - Applies current width to GrapesJS DeviceManager
 */
function CustomViewportInput({value, onChange, onApply}) {
    return (
        <div
            className={[
                "flex items-center rounded border border-ui-border transition",
                "bg-ui-bg hover:bg-ui-button-hover text-text-subtle font-medium",
                "py-1 px-2 gap-1.5 text-tiny",
            ].join(" ")}
            title="Custom viewport width in px (e.g. 950)"
        >
            <input
                className={["w-[4.2rem] bg-transparent outline-none", "font-mono text-micro text-text"].join(" ")}
                inputMode="numeric"
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onApply();
                }}
                placeholder="950"
                value={value}
            />
            <button
                className="flex items-center h-6 bg-ui-bg-selected text-text px-1.5 rounded font-mono text-micro tracking-tight leading-none border border-ui-border"
                onClick={onApply}
                type="button"
            >
                px
            </button>
        </div>
    );
}

/**
 * ToolbarButton
 * Small icon button optionally showing a keyboard hint label.
 *
 * Props:
 * @param {React.ReactNode} icon - Icon element
 * @param {string=} label - Optional keyboard shortcut label (displayed as a pill)
 * @param {() => void} onClick - Click handler
 */
function ToolbarButton({icon, label, onClick}) {
    /**
     * Double-negation coerces label to boolean:
     * - true if label is a non-empty string
     * - false if label is "", null, undefined, etc.
     */
    const hasLabel = !!label;

    return (
        <button
            aria-label={label || "toolbar button"}
            className={[
                "flex items-center rounded border border-ui-border transition",
                "bg-ui-bg hover:bg-ui-button-hover text-text-subtle font-medium",
                "py-1",
                hasLabel ? "gap-1.5 px-2 text-tiny" : "px-1.5",
            ].join(" ")}
            onClick={onClick}
            title={label || undefined}
            type="button"
        >
      <span
          className="flex items-center justify-center bg-ui-default text-text rounded-full w-6 h-6 border border-ui-border">
        {icon}
      </span>

            {hasLabel ? (
                <span className="bg-ui-bg-selected text-text px-1.5 py-0.5 rounded font-mono text-micro tracking-tight">
          {label}
        </span>
            ) : null}
        </button>
    );
}

/**
 * TopActionButton
 * Primary/secondary action button (Save/Export/Publish).
 *
 * Props:
 * @param {string} label
 * @param {boolean=} primary - If true, uses primary styling
 * @param {() => void} onClick
 */
function TopActionButton({label, primary = false, onClick}) {
    return (
        <button className={["btn-wb", primary ? "btn-wb--primary" : ""].join(" ")} onClick={onClick} type="button">
            <span className="py-0.5 font-mono">{label}</span>
        </button>
    );
}

/**
 * ZoomListbox
 * HeadlessUI Listbox for selecting a zoom percentage.
 *
 * Props:
 * @param {number} value - Current zoom (e.g. 100)
 * @param {(val: number) => void} onChange - Called with selected option
 * @param {number[]} options - List of zoom values
 */
function ZoomListbox({value, onChange, options}) {
    return (
        <Listbox onChange={onChange} value={value}>
            <div className="relative">
                <ListboxButton
                    className={[
                        "flex items-center rounded border border-ui-border transition",
                        "bg-ui-bg hover:bg-ui-button-hover text-text-subtle font-medium",
                        "py-1 px-2 gap-1.5 text-tiny",
                        "focus:outline-none",
                    ].join(" ")}
                >
          <span
              className="flex items-center h-6 bg-ui-bg-selected text-text px-1.5 rounded font-mono text-micro tracking-tight leading-none">
            {value}%
          </span>

                    <span
                        aria-hidden
                        className="inline-block border-x-4 border-x-transparent border-t-4 border-t-text-subtle translate-y-[1px]"
                    />
                </ListboxButton>

                <ListboxOptions
                    className={[
                        "absolute right-0 z-10 mt-0.5",
                        "bg-ui-bg border border-ui-border rounded-[5px]",
                        "shadow-lg overflow-hidden",
                        "py-1",
                        "focus:outline-none",
                        "min-w-[3.7rem]",
                    ].join(" ")}
                >
                    {options.map((opt) => (
                        <ListboxOption key={opt} value={opt}>
                            {({active, selected}) => (
                                <div
                                    className={[
                                        "w-full text-left px-2 py-1 text-tiny transition-colors",
                                        active ? "bg-ui-bg-selected text-text" : "bg-ui-bg text-text-subtle",
                                        selected ? "font-semibold text-text" : "font-normal",
                                    ].join(" ")}
                                >
                                    {opt}%
                                </div>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}

export default TopPanel;