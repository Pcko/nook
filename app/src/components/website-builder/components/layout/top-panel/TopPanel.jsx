/* eslint-disable react/jsx-sort-props */
import React, {useEffect, useMemo, useState} from "react";
import {
    AiOutlineBorder,
    AiOutlineEye,
    AiOutlineLaptop,
    AiOutlineMobile,
    AiOutlinePlus,
    AiOutlineRedo,
    AiOutlineSave,
    AiOutlineTablet,
    AiOutlineUndo,
} from "react-icons/ai";
import {FiLogOut} from "react-icons/fi";

import WebsiteBuilderService from "../../../../../services/WebsiteBuilderService";
import {DeployModal} from "../../../../../features/publishing";
import useErrorHandler from "../../../../logging/ErrorHandler";
import {useMetaNotify} from "../../../../logging/MetaNotifyHook";

import CustomViewportInput from "./CustomViewportInput";
import ToolbarButton from "./ToolbarButton";
import TopActionButton from "./TopActionButton";
import ZoomListbox from "./ZoomListbox";
import {InfoTip} from "../../ui/TooltipSystem";
import {useBuilder} from "../../../hooks/UseBuilder";
import {addUserBloxBlockToEditor, saveSelectedComponentAsUserBlox} from "../../../utils/customBlox";
import {
    handleRedo,
    handleUndo,
    setDesktop,
    setMobile,
    setTablet,
    toggleOutlines,
    togglePreview
} from "../../../utils/grapesActions";
import {useNavigate} from "react-router-dom";

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
    const baseMeta = useMemo(
        () => ({
            feature: "builder",
            component: "TopPanel",
        }),
        []
    );

    const {notify} = useMetaNotify(baseMeta);
    const {selectedElement} = useBuilder();
    const handleError = useErrorHandler(baseMeta);
    const navigate = useNavigate();

    /**
     * Save indicator state
     * - "loaded": page came from backend and is currently just loaded
     * - "saved": page was explicitly saved in this session
     * - "unsaved": no known saved/loaded state
     */
    const [saveStatus, setSaveStatus] = useState(page ? "loaded" : "unsaved");
    const [lastSavedAt, setLastSavedAt] = useState(null);

    useEffect(() => {
        setLastSavedAt(null);
        setSaveStatus(page ? "loaded" : "unsaved");
    }, [page]);

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

    function handleSave() {
        WebsiteBuilderService.savePageState(editorRef.current, page)
            .then(() => {
                setLastSavedAt(new Date());
                setSaveStatus("saved");
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

    function handleSaveBlox() {
        if (!editorRef?.current || !selectedElement) {
            notify(
                "info",
                "Select a section or element first.",
                {stage: "save-blox", pageName: page?.name ?? null},
                "submit"
            );
            return;
        }

        const name = window.prompt("Name for this reusable blox:", selectedElement.getName?.() || "My section");
        if (name == null) return;

        try {
            const block = saveSelectedComponentAsUserBlox(editorRef.current, selectedElement, name);
            addUserBloxBlockToEditor(editorRef.current, block);
            notify(
                "info",
                `Saved reusable blox "${block.name}".`,
                {stage: "save-blox", pageName: page?.name ?? null, bloxName: block.name},
                "submit"
            );
        } catch (err) {
            handleError(err, {
                fallbackMessage: "Failed to save the reusable blox.",
                meta: {stage: "save-blox", pageName: page?.name ?? null},
            });
        }
    }

    const [zoom, setZoom] = useState(100);
    const [deployOpen, setDeployOpen] = useState(false);
    const [customViewport, setCustomViewport] = useState("");
    const [showCustomViewport, setShowCustomViewport] = useState(false);
    const [lastAppliedCustomWidth, setLastAppliedCustomWidth] = useState(null);

    const setCanvasZoom = (val) => {
        const editor = editorRef?.current;
        if (!editor) return;

        editor.Canvas.setZoom(val);
        setZoom(val);

        const frameEl = editor.Canvas.getFrameEl?.();
        const canvasEl = editor.Canvas.getElement?.();
        if (!frameEl || !canvasEl) return;

        const baseHeight = canvasEl.clientHeight || 800;
        const newHeight = baseHeight * (100 / val);
        frameEl.style.height = `${newHeight}px`;
    };

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

    const applyCustomViewport = () => {
        const raw = String(customViewport).trim();
        const width = parseInt(raw, 10);
        if (!Number.isFinite(width) || width <= 0) return;

        setLastAppliedCustomWidth(width);
        ensureAndSetCustomDevice(width);
    };

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

    const handlePlus = () => {
        setShowCustomViewport(true);

        if (lastAppliedCustomWidth && Number.isFinite(lastAppliedCustomWidth)) {
            ensureAndSetCustomDevice(lastAppliedCustomWidth);
            if (!customViewport) setCustomViewport(String(lastAppliedCustomWidth));
        }
    };

    return (
        <div className="h-12 grid grid-cols-[1fr_auto_1fr] items-center px-4 border border-ui-border bg-ui-bg text-text font-sans gap-2">
            {/* left group */}
            <div className="flex items-center gap-2">
                <ToolbarButton
                    icon={<FiLogOut size={18} style={{transform: "scaleX(-1)"}} />}
                    tooltip="Back to Dashboard"
                    onClick={() => navigate(-1)}
                />
                <ToolbarButton icon={<AiOutlineUndo size={18} />} label="Str+Z" tooltip="Undo (Str+Z)" onClick={() => handleUndo(editorRef)} />
                <ToolbarButton icon={<AiOutlineRedo size={18} />} label="Str+Y" tooltip="Redo (Str+Y)" onClick={() => handleRedo(editorRef)} />
                <ToolbarButton icon={<AiOutlineBorder size={18} />} label="Alt+O" tooltip="Toggle outlines (Alt+O)" onClick={() => toggleOutlines(editorRef)} />
                <ToolbarButton icon={<AiOutlineEye size={18} />} label="Alt+P" tooltip="Toggle preview (Alt+P)" onClick={() => togglePreview(editorRef)} />
            </div>

            {/* center group */}
            <div className="flex items-center justify-center gap-2">
                <ToolbarButton icon={<AiOutlinePlus size={18} />} tooltip="Custom viewport width" onClick={handlePlus} />

                {showCustomViewport && (
                    <CustomViewportInput
                        onApply={applyCustomViewport}
                        onChange={setCustomViewport}
                        value={customViewport}
                    />
                )}

                <ToolbarButton icon={<AiOutlineLaptop size={18} />} tooltip="Desktop viewport" onClick={handleDesktop} />
                <ToolbarButton icon={<AiOutlineTablet size={18} />} tooltip="Tablet viewport" onClick={handleTablet} />
                <ToolbarButton icon={<AiOutlineMobile size={18} />} tooltip="Mobile viewport" onClick={handleMobile} />

                <div
                    className="flex items-center gap-1"
                    data-wb-tooltip="Zoom only changes the editor view (it does not affect export)."
                    data-wb-tooltip-delay="650"
                >
                    <ZoomListbox onChange={(val) => setCanvasZoom(val)} options={[25, 50, 75, 100]} value={zoom} />
                    <InfoTip text="Zoom only changes the editor view (it does not affect export)." />
                </div>
            </div>

            {/* right group */}
            <div className="flex items-center justify-end gap-2">
                <div
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-ui-border bg-ui-default/40 text-[11px] leading-none text-text/70 whitespace-nowrap select-none"
                    data-wb-tooltip="Status der aktuellen Seite."
                    data-wb-tooltip-delay="650"
                >
                    {saveStatus === "saved" && lastSavedAt ? (
                        <>
                            <span>Gespeichert</span>
                            <span className="font-mono text-text/80">{formatLastSavedAt(lastSavedAt)}</span>
                        </>
                    ) : saveStatus === "loaded" ? (
                        <span className="text-text/70">Geladen</span>
                    ) : (
                        <span className="text-text/60">Nicht gespeichert</span>
                    )}
                </div>

                <div
                    data-wb-tooltip="Save selected element as reusable blox"
                    data-wb-tooltip-delay="650"
                >
                    <TopActionButton
                        label="Blox"
                        onClick={handleSaveBlox}
                        icon={<AiOutlineSave size={16} />}
                        disabled={!selectedElement}
                    />
                </div>

                <TopActionButton label="Save" onClick={handleSave} />
                <TopActionButton label="Publish" onClick={() => setDeployOpen(true)} primary />
            </div>

            <DeployModal
                onClose={() => setDeployOpen(false)}
                open={deployOpen}
                page={page}
                publicBaseUrl={import.meta.env.VITE_PUBLISH_URL}
            />
        </div>
    );
}

export default TopPanel;