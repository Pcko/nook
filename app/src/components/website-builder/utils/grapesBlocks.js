// grapesBlocks.js

/**
 * Block label helpers
 *
 * We intentionally use inline SVGs instead of icon-font classes.
 * This makes the block palette self-contained and prevents missing icons
 * when FontAwesome/Bootstrap Icons are not globally loaded.
 */

const svg = {
  text: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 6h16M4 10h10M4 14h16M4 18h12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `,
  bold: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 5h6a4 4 0 0 1 0 8H7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M7 13h7a4 4 0 0 1 0 8H7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>
  `,
  tinyText: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 18V6h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 6v12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M13 18v-6h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 12v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `,
  h1: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 6v12M10 6v12M4 12h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M18 18V6l-2 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  h2: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 6v12M10 6v12M4 12h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M15 10a3 3 0 0 1 6 0c0 3-6 4-6 8h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  h3: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 6v12M10 6v12M4 12h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M16 9h3a2.5 2.5 0 0 1 0 5h-1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M16 14h3a2.5 2.5 0 0 1 0 5h-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `,
  box: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
    </svg>
  `,
  circle: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/>
    </svg>
  `,
  section: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M7 10h10M7 14h7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `,
  cols2: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M12 6v12" fill="none" stroke="currentColor" stroke-width="1.6"/>
    </svg>
  `,
  cols3: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M9.33 6v12M14.66 6v12" fill="none" stroke="currentColor" stroke-width="1.6"/>
    </svg>
  `,
  cols37: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M9 6v12" fill="none" stroke="currentColor" stroke-width="1.6"/>
    </svg>
  `,
  button: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="8" width="16" height="8" rx="4" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M12 12h0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    </svg>
  `,
  link: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  image: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M8 14l2-2 4 4 2-2 3 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="9" cy="10" r="1.2" fill="currentColor"/>
    </svg>
  `,
  star: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 21.8l1.1-6.5L2.6 9.8l6.5-.9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>
  `,
};

function makeBlockLabel(title, iconSvg) {
  return `
    <div class="wb-block-label">
      <div class="wb-block-label__title">${title}</div>
      <div class="wb-block-label__icon">${iconSvg}</div>
    </div>
  `;
}
export const textBlocks = [
  // Paragraph Text Block
  {
    id: "text-block",
    label: makeBlockLabel("Text", svg.text),
    tooltip: "Add a text paragraph",
    content: {
      type: "text",
      content: "Text",
    },
    category: "Text",
  },

  // Bold Text Block
  {
    id: "bold-text-block",
    label: makeBlockLabel("Bold", svg.bold),
    tooltip: "Add bold text",
    content: {
      type: "text",
      content: "<strong>Bold Text</strong>",
    },
    category: "Text",
  },

  // Tiny Text Block
  {
    id: "tiny-text-block",
    label: makeBlockLabel("Tiny", svg.tinyText),
    tooltip: "Add small text",
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
    label: makeBlockLabel("H1", svg.h1),
    tooltip: "Add a H1 heading",
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
    label: makeBlockLabel("H2", svg.h2),
    tooltip: "Add a H2 heading",
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
    label: makeBlockLabel("H3", svg.h3),
    tooltip: "Add a H3 heading",
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
    label: makeBlockLabel("Box", svg.box),
    tooltip: "Add a container box",
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
    label: makeBlockLabel("Circle", svg.circle),
    tooltip: "Add a circle shape",
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
    label: makeBlockLabel("Section", svg.section),
    tooltip: "Add a section",
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
    label: makeBlockLabel("2 Cols", svg.cols2),
    tooltip: "Add a two-column layout",
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
    label: makeBlockLabel("3 Cols", svg.cols3),
    tooltip: "Add a three-column layout",
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
  label: makeBlockLabel("30/70", svg.cols37),
  tooltip: "Add a 30/70 split layout",
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
    label: makeBlockLabel("Button", svg.button),
    tooltip: "Add a button",
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
    label: makeBlockLabel("Link", svg.link),
    tooltip: "Add a link",
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
    label: makeBlockLabel("Image", svg.image),
    tooltip: "Add an image",
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
    label: makeBlockLabel("Icon", svg.star),
    tooltip: "Add an icon",
    content: {
      type: "text",
      // Inline SVG so exported pages don't depend on external icon-fonts.
      content: `
        <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true" focusable="false">
          <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 21.8l1.1-6.5L2.6 9.8l6.5-.9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>
      `,
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
      // Improve UX: show a native tooltip on hover.
      attributes: {
        title: block.tooltip || block.category || block.id,
      },
    });
  });
}
