// grapesBlocks.js
export const textBlocks = [
  // Paragraph Text Block
  {
    id: "text-block",
    label: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p>Text</p>
        <i class="fa fa-font" style="font-size: 30px; margin-top:10px;"></i>
      </div>
    `,
    content: {
      type: "text",
      content: "Text",
    },
    category: "Text",
  },

  // Bold Text Block
  {
    id: "bold-text-block",
    label: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p>Bold</p>
        <i class="fa fa-bold" style="font-size: 30px; margin-top:10px;"></i>
      </div>
    `,
    content: {
      type: "text",
      content: "<strong>Bold Text</strong>",
    },
    category: "Text",
  },

  // Tiny Text Block
  {
    id: "tiny-text-block",
    label: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p>Tiny Text</p>
        <i class="fa fa-text-height" style="font-size: 30px; margin-top:10px;"></i>
      </div>
    `,
    content: {
      type: "text",
      style: { "font-size": "12px" },
      content: "Tiny Text",
    },
    category: "Text",
  },

  // H1 Text Block
  {
    id: "h1-text-block",
    label: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p>H1 Text</p>
        <i class="bi bi-type-h1" style="font-size: 35px; margin-top:10px;
          text-shadow:
          0.3px 0 currentColor,
          -0.3px 0 currentColor,
          0 0.3px currentColor,
          0 -0.3px currentColor;">
        </i>
      </div>
    `,
    content: {
      type: "text",
      tagName: "h1",
      content: "Heading 1",
    },
    category: "Text",
  },

  // H2 Text Block
  {
    id: "h2-text-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>H2 Text</p>
        <i class="bi bi-type-h2" style="font-size:35px;margin-top:10px;
        text-shadow:
          0.3px 0 currentColor,
          -0.3px 0 currentColor,
          0 0.3px currentColor,
          0 -0.3px currentColor;">
        </i>
      </div>
    `,
    content: {
      type: "text",
      tagName: "h2",
      content: "Heading 2",
    },
    category: "Text",
  },

  // H3 Text Block
  {
    id: "h3-text-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>H3 Text</p>
        <i class="bi bi-type-h3" style="font-size:35px;margin-top:10px;
        text-shadow:
          0.3px 0 currentColor,
          -0.3px 0 currentColor,
          0 0.3px currentColor,
          0 -0.3px currentColor;">  
        </i>
      </div>
    `,
    content: {
      type: "text",
      tagName: "h3",
      content: "Heading 3",
    },
    category: "Text",
  },
];

export const coreStructureBlocks = [

  // Box Block
  {
    id: "box-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>Box</p>
        <i class="fa fa-square-o" style="font-size:30px;margin-top:10px;"></i>
      </div>
    `,
    category: "Core Structure",
    content: {
      type: "div",
      style: {
        padding: "24px",
        border: "1px solid #ddd",
        display: "flex",
        "flex-direction": "column",
      },
      components: [],
    }
  },

  // Circle Block
  {
    id: "circle-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>Circle</p>
        <i class="fa fa-circle-o" style="font-size:30px;margin-top:10px;"></i>
      </div>
    `,
    category: "Core Structure",
    content: {
      type: "div",
      style: {
        width: "120px",
        height: "120px",
        "border-radius": "50%",
        "background-color": "#eee",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      },
      components: [
        { type: "text", content: "Circle" }
      ]
    }
  },

  // Section Block
  {
    id: "section-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>Section</p>
        <i class="fa fa-align-left" style="font-size:30px;margin-top:10px;"></i>
      </div>
    `,
    category: "Core Structure",
    content: {
      type: "section",
      style: {
        padding: "40px 20px",
        background: "#f7f7f7",
        "min-height": "100px",
        border: "1px dashed #ccc",
      },
      components: []
    }
  },

  // 2 Columns Block
  {
    id: "two-col-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>2 Columns</p>
        <i class="fa fa-columns" style="font-size:30px;margin-top:10px;"></i>
      </div>
    `,
    category: "Core Structure",
    content: {
      type: "div",
      style: {
        display: "flex",
        gap: "10px",
      },
      components: [
        {
          type: "div",
          style: {
            flex: "1",
            padding: "20px",
            "min-height": "60px",
            border: "1px solid #ddd",
          }
        },
        {
          type: "div",
          style: {
            flex: "1",
            padding: "20px",
            "min-height": "60px",
            border: "1px solid #ddd",
          }
        }
      ]
    }
  },

  // 3 Columns Block
  {
    id: "three-col-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>3 Columns</p>
        <i class="fa fa-th" style="font-size:30px;margin-top:10px;"></i>
      </div>
    `,
    category: "Core Structure",
    content: {
      type: "div",
      style: { display: "flex", gap: "10px" },
      components: [
        { type: "div", style: { flex: "1", padding: "20px", border: "1px solid #ddd" } },
        { type: "div", style: { flex: "1", padding: "20px", border: "1px solid #ddd" } },
        { type: "div", style: { flex: "1", padding: "20px",  border: "1px solid #ddd" } }
      ]
    }
  },
  // 3/7 Columns Block (30% | 70%)
  {
  id: "three-seven-col-block",
  label: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <p>3/7 Column</p>
      <i class="fa fa-align-justify" style="font-size:30px;margin-top:10px;"></i>
    </div>
  `,
  category: "Core Structure",
  content: {
    type: "div",
    style: { display: "flex", gap: "10px" },
    components: [
      { type: "div", style: { flex: "3", padding: "20px", "min-height": "60px", border: "1px solid #ddd" } },
      { type: "div", style: { flex: "7", padding: "20px", "min-height": "60px", border: "1px solid #ddd" } }
    ]
  }
}
];

export const interactiveBlocks = [
  // Button Block
  {
    id: "button-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>Button</p>
        <i class="fa fa-hand-pointer-o" style="font-size:30px;margin-top:10px;"></i>
      </div>
    `,
    content: {
      type: "button",
      content: "Click me",
      style: {
        padding: "10px 20px",
        "background-color": "#007bff",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      },
    },
    category: "Interactive",
  },

  // Link Block
  {
    id: "link-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>Link</p>
        <i class="fa fa-link" style="font-size:30px;margin-top:10px;"></i>
      </div>
    `,
    content: {
      type: "link",
      content: "My Link",
      attributes: {
        href: "#",
        target: "_blank",
      },
      style: {
        color: "#007bff",
        "text-decoration": "underline",
        cursor: "pointer",
      },
    },
    category: "Interactive",
  },
];

export const contentBlocks = [
  // Image Block
  {
    id: "image-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>Image</p>
        <i class="fa fa-picture-o" style="font-size:30px;margin-top:10px;"></i>
      </div>
    `,
    content: {
      type: "image",
      attributes: {
        src: "https://via.placeholder.com/150",
        alt: "Placeholder Image",
      },
      style: {
        width: "100%",
        height: "auto",
      },
    },
    category: "Content",
  },

  // Icon Block
  {
    id: "icon-block",
    label: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <p>Icon</p>
        <i class="fa fa-star" style="font-size:30px;margin-top:10px;"></i>
      </div>
    `,
    content: {
      type: "text",
      content: `<i class="fa fa-star" aria-hidden="true"></i>`,
      style: {
        "font-size": "30px",
      },
    },
    category: "Content",
  },
];

/**
 * Combined list of all custom block definitions
*/
export const grapesBlocks = [
  ...textBlocks,
  ...coreStructureBlocks,
  ...interactiveBlocks,
  ...contentBlocks,
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
