// grapesBlocks.js
export const grapesBlocks = [
  {
    id: "text-block",
    label: "Text",
    content: {
      type: "text",
      content: "Text",
    },
    category: "Components",
  },
  {
    id: "column2",
    label: "2 Columns",
    content: {
      type: "div",
      style: {
        "display": "flex",
        "flex-wrap": "wrap",
        "padding": "10px"
      },
      components: [
        {
          type: "div",
          style: {
            "flex": "1",
            "padding": "10px",
            "min-height": "50px"
          },
          components: [],
        },
        {
          type: "div",
          style: {
            "flex": "1",
            "padding": "10px",
            "min-height": "50px"
          },
          components: [],
        },
      ],
    },
    category: "Layout",
  },
];


/**
 * Load blocks into GrapesJS BlockManager
 * @param {Object} editor GrapesJS editor instance
 */
export function loadCustomBlocks(editor) {
  grapesBlocks.forEach((block) => {
    editor.BlockManager.add(block.id, {
      label: block.label,
      content: block.content,
      category: block.category,
    });
  });
}