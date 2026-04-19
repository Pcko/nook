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
  grid: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <rect x="14" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <rect x="4" y="14" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <rect x="14" y="14" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
    </svg>
  `,
  hero: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M7 10h10M7 13h7M7 16h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `,
  cards: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="7" width="5" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <rect x="9.5" y="7" width="5" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <rect x="15" y="7" width="5" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
    </svg>
  `,
  quote: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 9H5v4h3l-2 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17 9h-3v4h3l-2 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  footer: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M4 15h16" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M7 17.5h4M15 17.5h2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `,
};

/**
 *
 * @param title
 * @param iconSvg
 */
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

export const bloxBlocks = [
  {
    id: "blox-hero-section",
    label: makeBlockLabel("Hero", svg.hero),
    tooltip: "Reusable hero section template",
    category: "Blox",
    content: {
      type: "section",
      style: {
        padding: "72px 24px",
        "background-color": "#f8fafc",
      },
      components: [
        {
          type: "div",
          style: {
            "max-width": "1120px",
            margin: "0 auto",
            display: "flex",
            "flex-direction": "column",
            gap: "20px",
            "align-items": "flex-start",
          },
          components: [
            {
              type: "text",
              tagName: "h1",
              content: "A clear headline for your section",
              style: {
                margin: "0",
                "font-size": "48px",
                "line-height": "1.1",
                "font-weight": "700",
                color: "#111827",
              },
            },
            {
              type: "text",
              content: "Use this reusable hero block to introduce a page, product, or important message with consistent spacing and hierarchy.",
              style: {
                margin: "0",
                "font-size": "18px",
                "line-height": "1.6",
                color: "#4b5563",
                "max-width": "720px",
              },
            },
            {
              type: "div",
              style: {
                display: "flex",
                gap: "12px",
                "flex-wrap": "wrap",
              },
              components: [
                {
                  type: "button",
                  content: "Primary Action",
                  style: {
                    padding: "12px 20px",
                    "background-color": "#111827",
                    color: "#ffffff",
                    border: "none",
                    "border-radius": "8px",
                    cursor: "pointer",
                  },
                },
                {
                  type: "link",
                  content: "Secondary Link",
                  attributes: { href: "#" },
                  style: {
                    display: "inline-flex",
                    "align-items": "center",
                    padding: "12px 0",
                    color: "#111827",
                    "text-decoration": "none",
                    "font-weight": "600",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "blox-feature-grid",
    label: makeBlockLabel("Features", svg.grid),
    tooltip: "Reusable three-feature section template",
    category: "Blox",
    content: {
      type: "section",
      style: {
        padding: "64px 24px",
        "background-color": "#ffffff",
      },
      components: [
        {
          type: "div",
          style: {
            "max-width": "1120px",
            margin: "0 auto",
            display: "flex",
            "flex-direction": "column",
            gap: "24px",
          },
          components: [
            {
              type: "text",
              tagName: "h2",
              content: "Feature section",
              style: {
                margin: "0",
                "font-size": "32px",
                "font-weight": "700",
                color: "#111827",
              },
            },
            {
              type: "div",
              style: {
                display: "flex",
                gap: "20px",
                "flex-wrap": "wrap",
              },
              components: [
                {
                  type: "div",
                  style: {
                    flex: "1 1 240px",
                    padding: "24px",
                    border: "1px solid #e5e7eb",
                    "border-radius": "12px",
                    "background-color": "#f9fafb",
                  },
                  components: [
                    { type: "text", tagName: "h3", content: "Feature one", style: { margin: "0 0 8px 0", "font-size": "20px", "font-weight": "600" } },
                    { type: "text", content: "Describe a benefit or reusable content block here.", style: { margin: "0", color: "#4b5563", "line-height": "1.6" } },
                  ],
                },
                {
                  type: "div",
                  style: {
                    flex: "1 1 240px",
                    padding: "24px",
                    border: "1px solid #e5e7eb",
                    "border-radius": "12px",
                    "background-color": "#f9fafb",
                  },
                  components: [
                    { type: "text", tagName: "h3", content: "Feature two", style: { margin: "0 0 8px 0", "font-size": "20px", "font-weight": "600" } },
                    { type: "text", content: "Keep layouts consistent by reusing this section across pages.", style: { margin: "0", color: "#4b5563", "line-height": "1.6" } },
                  ],
                },
                {
                  type: "div",
                  style: {
                    flex: "1 1 240px",
                    padding: "24px",
                    border: "1px solid #e5e7eb",
                    "border-radius": "12px",
                    "background-color": "#f9fafb",
                  },
                  components: [
                    { type: "text", tagName: "h3", content: "Feature three", style: { margin: "0 0 8px 0", "font-size": "20px", "font-weight": "600" } },
                    { type: "text", content: "Replace the text, keep the structure, and build faster.", style: { margin: "0", color: "#4b5563", "line-height": "1.6" } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "blox-split-content",
    label: makeBlockLabel("Split", svg.cols2),
    tooltip: "Reusable content split section template",
    category: "Blox",
    content: {
      type: "section",
      style: {
        padding: "64px 24px",
        "background-color": "#ffffff",
      },
      components: [
        {
          type: "div",
          style: {
            "max-width": "1120px",
            margin: "0 auto",
            display: "flex",
            gap: "32px",
            "align-items": "center",
            "flex-wrap": "wrap",
          },
          components: [
            {
              type: "div",
              style: { flex: "1 1 320px" },
              components: [
                { type: "text", tagName: "h2", content: "Text with supporting visual", style: { margin: "0 0 12px 0", "font-size": "32px", "font-weight": "700" } },
                { type: "text", content: "Use this reusable split layout for product highlights, story sections, or explanatory content.", style: { margin: "0 0 16px 0", color: "#4b5563", "line-height": "1.7" } },
                { type: "button", content: "Learn more", style: { padding: "12px 20px", "background-color": "#111827", color: "#fff", border: "none", "border-radius": "8px", cursor: "pointer" } },
              ],
            },
            {
              type: "div",
              style: {
                flex: "1 1 320px",
                padding: "48px 24px",
                "min-height": "240px",
                border: "1px dashed #cbd5e1",
                "border-radius": "16px",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
                "background-color": "#f8fafc",
              },
              components: [
                { type: "text", content: "Image or media", style: { margin: "0", color: "#64748b", "font-weight": "600" } },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "blox-card-row",
    label: makeBlockLabel("Cards", svg.cards),
    tooltip: "Reusable card row section template",
    category: "Blox",
    content: {
      type: "section",
      style: {
        padding: "64px 24px",
        "background-color": "#f8fafc",
      },
      components: [
        {
          type: "div",
          style: {
            "max-width": "1120px",
            margin: "0 auto",
            display: "flex",
            gap: "20px",
            "flex-wrap": "wrap",
          },
          components: [
            {
              type: "div",
              style: { flex: "1 1 240px", padding: "24px", "border-radius": "16px", "background-color": "#ffffff", border: "1px solid #e5e7eb" },
              components: [
                { type: "text", tagName: "h3", content: "Card title", style: { margin: "0 0 10px 0", "font-size": "20px", "font-weight": "600" } },
                { type: "text", content: "Use this as a repeated content card inside your page sections.", style: { margin: "0", color: "#4b5563", "line-height": "1.6" } },
              ],
            },
            {
              type: "div",
              style: { flex: "1 1 240px", padding: "24px", "border-radius": "16px", "background-color": "#ffffff", border: "1px solid #e5e7eb" },
              components: [
                { type: "text", tagName: "h3", content: "Card title", style: { margin: "0 0 10px 0", "font-size": "20px", "font-weight": "600" } },
                { type: "text", content: "Duplicate and edit it to maintain a consistent layout system.", style: { margin: "0", color: "#4b5563", "line-height": "1.6" } },
              ],
            },
            {
              type: "div",
              style: { flex: "1 1 240px", padding: "24px", "border-radius": "16px", "background-color": "#ffffff", border: "1px solid #e5e7eb" },
              components: [
                { type: "text", tagName: "h3", content: "Card title", style: { margin: "0 0 10px 0", "font-size": "20px", "font-weight": "600" } },
                { type: "text", content: "The structure stays stable while the content stays flexible.", style: { margin: "0", color: "#4b5563", "line-height": "1.6" } },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "blox-testimonial",
    label: makeBlockLabel("Quote", svg.quote),
    tooltip: "Reusable testimonial section template",
    category: "Blox",
    content: {
      type: "section",
      style: {
        padding: "64px 24px",
        "background-color": "#111827",
      },
      components: [
        {
          type: "div",
          style: {
            "max-width": "860px",
            margin: "0 auto",
            display: "flex",
            "flex-direction": "column",
            gap: "16px",
          },
          components: [
            { type: "text", content: '“A short testimonial or customer quote can live here.”', style: { margin: "0", color: "#ffffff", "font-size": "28px", "line-height": "1.5", "font-weight": "600" } },
            { type: "text", content: "Name, role or company", style: { margin: "0", color: "#cbd5e1", "font-size": "16px" } },
          ],
        },
      ],
    },
  },
  {
    id: "blox-footer",
    label: makeBlockLabel("Footer", svg.footer),
    tooltip: "Reusable footer section template",
    category: "Blox",
    content: {
      type: "footer",
      style: {
        padding: "32px 24px",
        "background-color": "#0f172a",
      },
      components: [
        {
          type: "div",
          style: {
            "max-width": "1120px",
            margin: "0 auto",
            display: "flex",
            gap: "16px",
            "justify-content": "space-between",
            "align-items": "center",
            "flex-wrap": "wrap",
          },
          components: [
            { type: "text", content: "Brand or project name", style: { margin: "0", color: "#ffffff", "font-weight": "600" } },
            {
              type: "div",
              style: { display: "flex", gap: "16px", "flex-wrap": "wrap" },
              components: [
                { type: "link", content: "Privacy", attributes: { href: "#" }, style: { color: "#cbd5e1", "text-decoration": "none" } },
                { type: "link", content: "Imprint", attributes: { href: "#" }, style: { color: "#cbd5e1", "text-decoration": "none" } },
                { type: "link", content: "Contact", attributes: { href: "#" }, style: { color: "#cbd5e1", "text-decoration": "none" } },
              ],
            },
          ],
        },
      ],
    },
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
  ...contentBlocks
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
