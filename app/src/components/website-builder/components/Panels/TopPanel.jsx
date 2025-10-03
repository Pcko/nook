import React from "react";

/**
 * TopPanel component
 *
 * Renders the top toolbar of the website builder.
 * controls such as undo/redo, preview toggle, and save actions.
 *
 * @component
 * @returns {JSX.Element} The rendered top panel
 */
function TopPanel() {
  return (
    <div className="h-12 bg-gray-800 text-white flex items-center px-4">
      <p className="font-bold">Top Panel</p>
    </div>
  );
}

export default TopPanel;
