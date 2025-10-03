import React from "react";

/**
 * LeftPanel component
 *
 * Renders the left sidebar for the website builder, including the GrapesJS block manager (#blocks)
 *
 * @component
 * @returns {JSX.Element} The rendered left panel
 */
function LeftPanel() {
  return (
    <div className="w-1/5 min-w-[200px] bg-gray-200 p-2 overflow-y-auto">
      <p className="font-semibold mb-2">Left Panel</p>
      <div id="blocks" />
    </div>
  );
}

export default LeftPanel;
