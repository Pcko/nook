/**
 * @file commands.js
 * @description Defines custom commands for GrapesJS.
 * Includes undo, redo, and code export functionalities.
 *
 * @module commands
 */

import beautify from "js-beautify";

export const addCustomCommands = (editor) => {
      /**
     * Undo the last action performed in the editor.
     *
     * @name undo
     * @function
     * @param {Object} editor - The GrapesJS editor instance.
     */
  editor.Commands.add("undo", {
    run: (editor) => editor.UndoManager.undo(),
  });

      /**
     * Redo the last undone action in the editor.
     *
     * @name redo
     * @function
     * @param {Object} editor - The GrapesJS editor instance.
     */
  editor.Commands.add("redo", {
    run: (editor) => editor.UndoManager.redo(),
  });

      /**
     * Show a code export modal displaying formatted HTML and CSS.
     *
     * @name show-code
     * @function
     * @param {Object} editor - The GrapesJS editor instance.
     */
  editor.Commands.add("show-code", {
    run: (editor) => {
      const rawHtml = editor.getHtml();
      const rawCss = editor.getCss();
      const formattedHtml = beautify.html(rawHtml, { indent_size: 2 });
      const formattedCss = beautify.css(rawCss, { indent_size: 2 });

      editor.Modal.open({
        title: "Code Export",
        content: `
          <div style="padding: 10px;">
            <h4>HTML</h4>
            <textarea style="width: 100%; height: 200px;" readonly>${formattedHtml}</textarea>
            <h4>CSS</h4>
            <textarea style="width: 100%; height: 200px;" readonly>${formattedCss}</textarea>
          </div>
        `,
      });
    },
  });
};
