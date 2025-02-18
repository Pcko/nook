import beautify from "js-beautify";

export const addCustomCommands = (editor) => {
  // Undo Command
  editor.Commands.add("undo", {
    run: (editor) => editor.UndoManager.undo(),
  });

  // Redo Command
  editor.Commands.add("redo", {
    run: (editor) => editor.UndoManager.redo(),
  });

  // Show Code Command
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
