import React from "react";

function LeftPanel() {
  return (
    <div className="w-1/5 min-w-[200px] bg-gray-200 p-2 overflow-y-auto">
      <p className="font-semibold mb-2">Left Panel</p>
      <div id="blocks" />
    </div>
  );
}

export default LeftPanel;
