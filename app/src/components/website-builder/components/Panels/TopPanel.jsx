import React, { useState } from "react";

import {
  AiOutlineBorder,
  AiOutlineLaptop,
  AiOutlineMobile,
  AiOutlineRedo,
  AiOutlineTablet,
  AiOutlineUndo,
} from "react-icons/ai";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import {handleRedo, handleUndo, setDesktop, setMobile, setTablet, toggleOutlines} from "../../utils/grapesActions";
import WebsiteBuilderService from "../../../../services/WebsiteBuilderService";
import useErrorHandler from "../../../general/ErrorHandler";

/**
 * TopPanel component
 *
 * Renders the top toolbar of the website builder.
 * controls such as undo/redo, preview toggle, and save actions.
 *
 * @component
 * @returns {JSX.Element} The rendered top panel
 */
function TopPanel({editorRef, page}) {
    const handleError = useErrorHandler();

    function handleSave() {
        WebsiteBuilderService.savePageState(editorRef.current, page)
            .catch((err) => {
                handleError(err);
            });
    }

    
    const [zoom, setZoom] = useState(100); // track active zoom (for highlighting)
    const setCanvasZoom = (val) => {
    const ed = editorRef?.current;
    if (!ed) return;

    // 1) Set zoom level (expects a percentage like 25, 50, 75, 100)
    ed.Canvas.setZoom(val);
    setZoom(val);

    // 2) Adjust the iframe height inversely to zoom, so zooming out shows more
    const frameEl = ed.Canvas.getFrameEl?.();
    const canvasEl = ed.Canvas.getElement?.();
    if (!frameEl || !canvasEl) return;

    const baseHeight = canvasEl.clientHeight || 800; // fallback height
    const newHeight = baseHeight * (100 / val);
    frameEl.style.height = `${newHeight}px`;
    };

    return (
        <div
            className="h-12 grid grid-cols-[1fr_auto_1fr] items-center px-4 border border-ui-border bg-ui-bg text-text font-sans gap-2">
            {/* left group */}
            <div className="flex items-center gap-2">
                <ToolbarButton
                    icon={<AiOutlineUndo size={18}/>}
                    label="Str+Z"
                    onClick={() => handleUndo(editorRef)}
                />
                <ToolbarButton
                    icon={<AiOutlineRedo size={18}/>}
                    label="Str+Y"
                    onClick={() => handleRedo(editorRef)}
                />
                <ToolbarButton
                    icon={<AiOutlineBorder size={18}/>}
                    label="Alt+O"
                    onClick={() => toggleOutlines(editorRef)}
                />
            </div>

            {/* center group */}
            <div className="flex items-center justify-center gap-2">
                <ToolbarButton
                    icon={<AiOutlineLaptop size={18}/>}
                    onClick={() => setDesktop(editorRef)}
                />
                <ToolbarButton
                    icon={<AiOutlineTablet size={18}/>}
                    onClick={() => setTablet(editorRef)}
                />
                <ToolbarButton
                    icon={<AiOutlineMobile size={18}/>}
                    onClick={() => setMobile(editorRef)}
                />
                <ZoomListbox
                  value={zoom}
                  onChange={(val) => setCanvasZoom(val)}
                  options={[25, 50, 75, 100]}
                />
            </div>

            {/* right group */}
            <div className="flex items-center justify-end gap-2">
                {/* add buttons later Save / Preview / publish */}
                <TopActionButton label={"Save"} onClick={() => handleSave()}/>
                <TopActionButton label={"Preview"}/>
                <TopActionButton label={"Publish"} primary={true}/>
            </div>
        </div>
    );
}

function ToolbarButton({icon, label, onClick}) {
    const hasLabel = !!label;

    return (
        <button
            onClick={onClick}
            aria-label={label || "toolbar button"}
            title={label || undefined}
            className={[
                "flex items-center rounded border border-ui-border transition",
                "bg-ui-bg hover:bg-ui-button-hover text-text-subtle font-medium",
                "py-1",                             // ← same vertical padding always
                hasLabel ? "gap-1.5 px-2 text-tiny" : "px-1.5", // ← only width/gap changes
            ].join(" ")}
        >
      <span
          className="
          flex items-center justify-center
          bg-ui-default text-text
          rounded-full w-6 h-6
          border border-ui-border
        "
      >
        {icon}
      </span>

            {hasLabel && (
                <span
                    className="
            bg-ui-bg-selected text-text
            px-1.5 py-0.5
            rounded
            font-mono text-micro tracking-tight
          "
                >
          {label}
        </span>
            )}
        </button>
    );
}

function TopActionButton({label, primary = false, onClick}) {
    return (
        <button
            onClick={onClick}
            className={[
                "btn-wb",
                primary ? "btn-wb--primary" : ""
            ].join(" ")}
        >
            <span className="px-1.5 py-0.5 font-mono text-micro">
              {label}
            </span>
        </button>
    );
}

function ZoomListbox({ value, onChange, options }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton
          className={[
            // match ToolbarButton outer styles
            "flex items-center rounded border border-ui-border transition",
            "bg-ui-bg hover:bg-ui-button-hover text-text-subtle font-medium",
            "py-1 px-2 gap-1.5 text-tiny",
            "focus:outline-none",
          ].join(" ")}
        >
          {/* pill gets the same intrinsic height as the old icon: h-6 */}
          <span
            className="
              flex items-center
              h-6
              bg-ui-bg-selected text-text
              px-1.5
              rounded
              font-mono text-micro tracking-tight
              leading-none
            "
          >
            {value}%
          </span>

          {/* chevron */}
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
              {({ active, selected }) => (
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