export const customBlocks = [
  {
    id: "box-block",
    label: "Box",
    content: {
      type: "Box",
      components: [],
      attributes: {
        style: "padding: 24px; border: 1px solid black; display: flex; flex-direction: column; flex: 1;",
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
      attributes: {
        style: "padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; text-align: center;",
        "data-action": "run-code",
        onmouseover: "this.style.backgroundColor='#38803c'",
        onmouseout: "this.style.backgroundColor='#4CAF50'",
      },
    },
    category: "Interactive",
  },
  {
    id: "column1",
    label: "1 Column",
    content: {
      type: "div",
      attributes: {
        style: "display: flex; flex-wrap: wrap; padding: 10px; border: 1px solid #ccc; min-height: 50px;",
      },
      components: [
        {
          type: "div",
          attributes: {
            style: "flex: 1; padding: 10px; border: 1px dashed #aaa; min-height: 50px; background-color: #f4f4f4;",
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
      attributes: {
        style: "display: flex; flex-wrap: wrap; padding: 10px; border: 1px solid #ccc;",
      },
      components: [
        {
          type: "div",
          attributes: {
            style: "flex: 1; padding: 10px; border: 1px dashed #aaa; min-height: 50px; background-color: #f4f4f4;",
          },
          components: [],
        },
        {
          type: "div",
          attributes: {
            style: "flex: 1; padding: 10px; border: 1px dashed #aaa; min-height: 50px; background-color: #f4f4f4;",
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
      attributes: {
        style: "display: flex; flex-wrap: wrap; padding: 10px; border: 1px solid #ccc;",
      },
      components: [
        {
          type: "div",
          attributes: {
            style: "flex: 1; padding: 10px; border: 1px dashed #aaa; min-height: 50px; background-color: #f4f4f4;",
          },
          components: [],
        },
        {
          type: "div",
          attributes: {
            style: "flex: 1; padding: 10px; border: 1px dashed #aaa; min-height: 50px; background-color: #f4f4f4;",
          },
          components: [],
        },
        {
          type: "div",
          attributes: {
            style: "flex: 1; padding: 10px; border: 1px dashed #aaa; min-height: 50px; background-color: #f4f4f4;",
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
      attributes: {
        style: "display: flex; flex-wrap: wrap; padding: 10px; border: 1px solid #ccc;",
      },
      components: [
        {
          type: "div",
          attributes: {
            style: "flex: 3; padding: 10px; border: 1px dashed #aaa; min-height: 50px; background-color: #f4f4f4;",
          },
          components: [],
        },
        {
          type: "div",
          attributes: {
            style: "flex: 7; padding: 10px; border: 1px dashed #aaa; min-height: 50px; background-color: #f4f4f4;",
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