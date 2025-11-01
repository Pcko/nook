import React from "react";

import {AiOutlineBorder, AiOutlineRedo, AiOutlineUndo, AiOutlineMobile, AiOutlineTablet, AiOutlineLaptop} from "react-icons/ai";
import { handleUndo, handleRedo, toggleOutlines, setDesktop, setTablet, setMobile } from "../../utils/grapesActions";

/**
 * TopPanel component
 *
 * Renders the top toolbar of the website builder.
 * controls such as undo/redo, preview toggle, and save actions.
 *
 * @component
 * @returns {JSX.Element} The rendered top panel
 */
function TopPanel({ editorRef }) {
  return (
    <div className="h-12 grid grid-cols-[1fr_auto_1fr] items-center px-4 border border-ui-border bg-ui-bg text-text font-sans gap-2">
       {/* left group */}
      <div className="flex items-center gap-2">
        <ToolbarButton
          icon={<AiOutlineUndo size={18} />}
          label="Str+Z"
          onClick={() => handleUndo(editorRef)}
        />
        <ToolbarButton
          icon={<AiOutlineRedo size={18} />}
          label="Str+Y"
          onClick={() => handleRedo(editorRef)}
        />
        <ToolbarButton
          icon={<AiOutlineBorder size={18} />}
          label="Alt+O"
          onClick={() => toggleOutlines(editorRef)}
        />
      </div>


      {/* center group */}
      <div className="flex items-center justify-center gap-2">
        <ToolbarButton
          icon={<AiOutlineLaptop size={18} />}
          onClick={() => setDesktop(editorRef)}
        />
        <ToolbarButton
          icon={<AiOutlineTablet size={18} />}
          onClick={() => setTablet(editorRef)}
        />
        <ToolbarButton
          icon={<AiOutlineMobile size={18} />}
          onClick={() => setMobile(editorRef)}
        />
      </div>

       {/* right group */}
      <div className="flex items-center justify-end gap-2">
        {/* add buttons later Save / Preview / publish */}
      </div>
    </div>
  );
}

function ToolbarButton({ icon, label, onClick }) {
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


export default TopPanel;