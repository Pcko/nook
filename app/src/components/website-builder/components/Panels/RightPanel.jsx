import React from "react";

/**
 * RightPanel component
 *
 * Renders the right sidebar for the website builder.
 * Contains the GrapesJS style manager
 *
 * @component
 * @returns {JSX.Element} The rendered right panel
 */
function RightPanel() {
  return (
    <div className="h-full min-w-[200px] bg-ui-bg p-2 overflow-y-auto">
      <p className="font-semibold mb-2">Right Panel</p>
      <div className="right-panel" />
    </div>
  );
}

export default RightPanel;
