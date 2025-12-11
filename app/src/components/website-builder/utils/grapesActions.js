/**
 * Undo the last action in GrapesJS editor.
 * @param {object} editorRef - Ref object containing the GrapesJS editor instance.
 */
export const handleUndo = (editorRef) => {
  editorRef?.current?.runCommand("core:undo");
};

/**
 * Redo the last undone action in GrapesJS editor.
 * @param {object} editorRef - Ref object containing the GrapesJS editor instance.
 */
export const handleRedo = (editorRef) => {
  editorRef?.current?.runCommand("core:redo");
};

/**
 * Toggle outline visibility for all components in the GrapesJS editor.
 * @param {object} editorRef - Ref object containing the GrapesJS editor instance.
 */
export const toggleOutlines = (editorRef) => {
  const editor = editorRef?.current;
  if (!editor) return;

  const CMD = "sw-visibility";
  const isActive = editor.Commands.isActive(CMD);

  if (isActive) {
    editor.stopCommand(CMD); // turn outlines OFF
  } else {
    editor.runCommand(CMD);  // turn outlines ON
  }
};

/**
 * Change editor to desktop.
 * @param {object} editorRef - Ref object containing the GrapesJS editor instance.
 */
export const setDesktop = (editorRef) => {editorRef?.current?.setDevice?.("Desktop")};

/**
 * Change editor to tablet.
 * @param {object} editorRef - Ref object containing the GrapesJS editor instance.
 */
export const setTablet  = (editorRef) => {editorRef?.current?.setDevice?.("Tablet")};

/**
 * Change editor to mobile.
 * @param {object} editorRef - Ref object containing the GrapesJS editor instance.
 */
export const setMobile  = (editorRef) => {editorRef?.current?.setDevice?.("Mobile")};

/**
 * Export the current website as a ZIP (using gjs-plugin-export).
 * @param {object} editorRef - Ref object containing the GrapesJS editor instance.
 */
export const exportWebsite = (editorRef) => {
  editorRef?.current?.runCommand("gjs-export-zip");
};

/**
 * Toggle preview mode in the GrapesJS editor.
 * When entering preview, it hides the editor UI (sw-visibility).
 * When exiting preview, it restores the UI.
 *
 * @param {object} editorRef - Ref object containing the GrapesJS editor instance.
 */
export const togglePreview = (editorRef) => {
  const editor = editorRef?.current;
  if (!editor) return;

  const PREVIEW_CMD = "core:preview";
  const VISIBILITY_CMD = "sw-visibility";
  const isPreviewActive = editor.Commands.isActive(PREVIEW_CMD);

  if (isPreviewActive) {
    // Leave preview: stop preview, restore visibility
    editor.stopCommand(PREVIEW_CMD);
    editor.runCommand(VISIBILITY_CMD);

    // NEW: remove preview class from body
    if (typeof document !== "undefined") {
      document.body.classList.remove("gjs-preview-active");
    }
  } else {
    // Enter preview: stop visibility, start preview
    editor.stopCommand(VISIBILITY_CMD);
    editor.runCommand(PREVIEW_CMD);

    // NEW: add preview class to body
    if (typeof document !== "undefined") {
      document.body.classList.add("gjs-preview-active");
    }
  }
};