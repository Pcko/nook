import React, { useMemo, useState } from "react";

import {
    AiOutlineBorder,
    AiOutlineLaptop,
    AiOutlineMobile,
    AiOutlineRedo,
    AiOutlineTablet,
    AiOutlineUndo,
    AiOutlineEye,
    AiOutlinePlus,
} from "react-icons/ai";
import { handleRedo, handleUndo, setDesktop, setMobile, setTablet, toggleOutlines, exportWebsite, togglePreview } from "../../../utils/grapesActions";
import WebsiteBuilderService from "../../../../../services/WebsiteBuilderService";
import useErrorHandler from "../../../../logging/ErrorHandler";
import { useMetaNotify } from "../../../../logging/MetaNotifyHook";

import CustomViewportInput from "./CustomViewportInput";
import ToolbarButton from "./ToolbarButton";
import TopActionButton from "./TopActionButton";
import ZoomListbox from "./ZoomListbox";
import { InfoTip } from "../../ui/TooltipSystem";

/**
 * TopPanel component
 */
function TopPanel({ editorRef, page }) {
    const baseMeta = useMemo(
            () => ({
                feature: "builder",
                component: "TopPanel",
            }),
            []
    );

    const { notify } = useMetaNotify(baseMeta);
    const handleError = useErrorHandler(baseMeta);

    function handleSave() {
        WebsiteBuilderService.savePageState(editorRef.current, page)
                .then(() => {
                    notify(
                            "info",
                            "Page was saved successfully.",
                            { stage: "page-save", pageName: page.name },
                            "submit"
                    );
                })
                .catch((err) => {
                    handleError(err, {
                        fallbackMessage: "Failed to save the page.",
                        meta: { stage: "page-save", pageName: page?.name ?? null },
                    });
                });
    }

    const [zoom, setZoom] = useState(100);

    // custom viewport state
    const [customViewport, setCustomViewport] = useState(""); // input field content
    const [showCustomViewport, setShowCustomViewport] = useState(false);
    const [lastAppliedCustomWidth, setLastAppliedCustomWidth] = useState(null); // number (e.g. 950) once applied

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
            dm.add(id, { name: "Custom", width: widthPx });
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

    // Device buttons should hide custom input (as requested)
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

    // "+" behavior:
    // - Show the input
    // - If user has already applied a width before, immediately switch to that custom device again
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
                            <CustomViewportInput
                                    value={customViewport}
                                    onChange={setCustomViewport}
                                    onApply={applyCustomViewport}
                            />
                    )}

                    <ToolbarButton icon={<AiOutlineLaptop size={18} />} tooltip="Desktop viewport" onClick={handleDesktop} />
                    <ToolbarButton icon={<AiOutlineTablet size={18} />} tooltip="Tablet viewport" onClick={handleTablet} />
                    <ToolbarButton icon={<AiOutlineMobile size={18} />} tooltip="Mobile viewport" onClick={handleMobile} />

                    <div className="flex items-center gap-1" data-wb-tooltip="Zoom only changes the editor view (it does not affect export)." data-wb-tooltip-delay="650">
                        <ZoomListbox onChange={(val) => setCanvasZoom(val)} options={[25, 50, 75, 100]} value={zoom} />
                        <InfoTip text="Zoom only changes the editor view (it does not affect export)." />
                    </div>
                </div>

                {/* right group */}
                <div className="flex items-center justify-end gap-2">
                    <TopActionButton label={"Save"} onClick={() => handleSave()} />
                    <TopActionButton label={"Export"} onClick={() => exportWebsite(editorRef)} />
                    <TopActionButton label={"Publish"} primary={true} />
                </div>
            </div>
    );
}

export default TopPanel;
