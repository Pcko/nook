/* eslint-disable react/jsx-sort-props */
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

import WebsiteBuilderService from "../../../../../services/WebsiteBuilderService";
import DeployModal from "../../../../deployment/DeployModal";
import useErrorHandler from "../../../../logging/ErrorHandler";
import { useMetaNotify } from "../../../../logging/MetaNotifyHook";

import CustomViewportInput from "./CustomViewportInput";
import ToolbarButton from "./ToolbarButton";
import TopActionButton from "./TopActionButton";
import ZoomListbox from "./ZoomListbox";
import { InfoTip } from "../../ui/TooltipSystem";
import {
    exportWebsite,
    handleRedo,
    handleUndo,
    setDesktop,
    setMobile,
    setTablet,
    toggleOutlines, togglePreview
} from "../../../utils/grapesActions";

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
     * Timestamp of the last successful save action.
     * Shown next to the Save button so users can verify that their latest changes are persisted.
     */
    const [lastSavedAt, setLastSavedAt] = useState(null);

    const formatLastSavedAt = (dt) => {
        if (!dt) return "";
        const date = dt instanceof Date ? dt : new Date(dt);
        if (Number.isNaN(date.getTime())) return "";

        const now = new Date();
        const sameDay =
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate();

        const time = new Intl.DateTimeFormat("de-AT", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);

        if (sameDay) return time;

        const day = new Intl.DateTimeFormat("de-AT", {
            day: "2-digit",
            month: "2-digit",
        }).format(date);

        return `${day}, ${time}`;
    };

    /**
     * Persist the current editor state to the backend.
     * Uses WebsiteBuilderService.savePageState(editor, page).
     */
    function handleSave() {
        WebsiteBuilderService.savePageState(editorRef.current, page)
            .then(() => {
                setLastSavedAt(new Date());
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
            // keep input prefilled (UX)
            if (!customViewport) setCustomViewport(String(lastAppliedCustomWidth));
        }
    };

    return (
            <div className="h-12 grid grid-cols-[1fr_auto_1fr] items-center px-4 border border-ui-border bg-ui-bg text-text font-sans gap-2">
                {/* left group */}
                <div className="flex items-center gap-2">
                    <ToolbarButton icon={<AiOutlineUndo size={18} />} label="Str+Z" tooltip="Undo (Str+Z)" onClick={() => handleUndo(editorRef)} />
                    <ToolbarButton icon={<AiOutlineRedo size={18} />} label="Str+Y" tooltip="Redo (Str+Y)" onClick={() => handleRedo(editorRef)} />
                    <ToolbarButton icon={<AiOutlineBorder size={18} />} label="Alt+O" tooltip="Toggle outlines (Alt+O)" onClick={() => toggleOutlines(editorRef)} />
                    <ToolbarButton icon={<AiOutlineEye size={18} />} label="Alt+P" tooltip="Toggle preview (Alt+P)" onClick={() => togglePreview(editorRef)} />
                </div>

                {/* center group */}
                <div className="flex items-center justify-center gap-2">
                    <ToolbarButton icon={<AiOutlinePlus size={18} />} tooltip="Custom viewport width" onClick={handlePlus} />

                {showCustomViewport && (
                    <CustomViewportInput onApply={applyCustomViewport} onChange={setCustomViewport}
                                         value={customViewport}/>
                )}

                    <ToolbarButton icon={<AiOutlineLaptop size={18} />} tooltip="Desktop viewport" onClick={handleDesktop} />
                    <ToolbarButton icon={<AiOutlineTablet size={18} />} tooltip="Tablet viewport" onClick={handleTablet} />
                    <ToolbarButton icon={<AiOutlineMobile size={18} />} tooltip="Mobile viewport" onClick={handleMobile} />

                    <div className="flex items-center gap-1" data-wb-tooltip="Zoom only changes the editor view (it does not affect export)." data-wb-tooltip-delay="650">
                        <ZoomListbox onChange={(val) => setCanvasZoom(val)} options={[25, 50, 75, 100]} value={zoom} />
                        <InfoTip text="Zoom only changes the editor view (it does not affect export)." />
                    </div>
                </div>

            {/* Right group: save/export/publish */}
            <div className="flex items-center justify-end gap-2">
                <div
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-ui-border bg-ui-default/40 text-[11px] leading-none text-text/70 whitespace-nowrap select-none"
                    data-wb-tooltip="Letzter Speicherzeitpunkt (letzter erfolgreicher Save)."
                    data-wb-tooltip-delay="650"
                >
                    {lastSavedAt ? (
                        <>
                            <span>Gespeichert</span>
                            <span className="font-mono text-text/80">{formatLastSavedAt(lastSavedAt)}</span>
                        </>
                    ) : (
                        <span className="text-text/60">Nicht gespeichert</span>
                    )}
                </div>
                <TopActionButton label="Save" onClick={handleSave}/>
                <TopActionButton label="Export" onClick={() => exportWebsite(editorRef)}/>
                <TopActionButton label="Publish" onClick={() => setDeployOpen(true)} primary/>
            </div>

            {/* Publish dialog */}
            <DeployModal
                onClose={() => setDeployOpen(false)}
                open={deployOpen}
                page={page}
                publicBaseUrl={import.meta.env.VITE_API_URL}
            />
        </div>
    );
}

export default TopPanel;