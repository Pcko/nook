// grapesBlocks.js
export const grapesBlocks = [
  {
    id: "text-block",
    label:  `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p>Text</p>
        <i class="fa fa-font" style="font-size: 30px; margin-top: 10px;"></i>
      </div>
    `,
    content: {
      type: "text",
      content: "Text",
    },
    category: "Components",
  },
    {
    id: "box-block",
    label:  `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p>Box</p>
        <i class="fa fa-square-o" style="font-size: 30px; margin-top: 10px;"></i>
      </div>
    `,
    content: {
      type: "Box",
      components: [],
      style: {
        "padding": "24px",
        "display": "flex",
        "flex-direction": "column",
        "flex": "1",
      },
    },
    category: "Components",
  },
  {
    id: "column2",
    label: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p>2 Columns</p>
        <i class="fa fa-columns" style="font-size: 30px; margin-top: 10px;"></i>
      </div>
    `,
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