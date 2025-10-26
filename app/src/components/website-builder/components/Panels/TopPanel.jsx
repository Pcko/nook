import React from "react";

import {AiOutlineBorder, AiOutlineRedo, AiOutlineUndo} from "react-icons/ai";
import { handleUndo, handleRedo, toggleOutlines } from "../../utils/grapesActions";

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
    <div className="h-12 flex items-center px-4 space-x-5 border border-ui-border bg-ui-bg text-text font-sans">
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
  );
}

function ToolbarButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-1.5
        px-2 py-1
        bg-ui-bg hover:bg-ui-button-hover
        rounded
        border border-ui-border
        text-tiny font-medium text-text-subtle
        transition
      "
    >
      <span
        className="
          flex items-center justify-center
          bg-ui-default
          rounded-full
          w-6 h-6
          border border-ui-border
          text-text
        "
      >
        {icon}
      </span>
      <span
        className="
          bg-ui-bg-selected text-text
          px-1.5 py-0.5
          rounded
          font-mono text-micro
          tracking-tight
        "
      >
        {label}
      </span>
    </button>
  );
}


export default TopPanel;
