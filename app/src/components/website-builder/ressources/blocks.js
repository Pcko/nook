/**
 * @file blocks.js
 * @description Defines custom block components for GrapesJS.
 * These blocks include various UI elements and layout structures.
 *
 * @module blocks
 */

export const customBlocks = [
  {
    id: "box-block",
    label: "Box",
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
    id: "text-block",
    label: "Text",
    content: {
      type: "text",
      content: "Text",
    },
    category: "Components",
  },
  {
    id: "button-block",
    label: "Button",
    content: {
      type: "button",
      content: "Click Me",
      style: {
        "padding": "10px 20px",
        "color": "black",
        "font-size": "16px",
        "background-color": "lightgrey",
        "cursor": "pointer",
      },
    },
    category: "Interactive",
  },
  {
    id: "column1",
    label: "1 Column",
    content: {
      type: "div",
      style: {
        "display": "flex",
        "flex-wrap": "wrap",
        "padding": "10px",
        "min-height": "50px"
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
      ],
    },
    category: "Layout",
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
  {
    id: "column3",
    label: "3 Columns",
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
  {
    id: "column3-7",
    label: "3/7 Grid",
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
            "flex": "3",
            "padding": "10px",
            "min-height": "50px"
          },
          components: [],
        },
        {
          type: "div",
          style: {
            "flex": "7",
            "padding": "10px",
            "min-height": "50px"
          },
          components: [],
        },
      ],
    },
    category: "Layout",
  },
  {
    id: "link",
    label: "Link",
    content: `
      <a href="#" style="color: blue; text-decoration: underline;">
        Click Here
      </a>`,
    category: "Interactive",
  },
  {
    id: "image",
    label: "Image",
    content: {
      type: "image",
      src: "https://via.placeholder.com/150",
      style: {
        width: "100%",
        height: "auto",
      },
    },
    category: "Media",
  },
];