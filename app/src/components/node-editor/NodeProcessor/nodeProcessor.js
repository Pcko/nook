const nodeHandlers = {
    "text": (component, value) => {
        component.set("content", value);
    },
    "style": (component, value) => {
        component.addStyle(value);
    },
    "class": (component, value) => {
        component.addClass(value);
    },
    "attributes": (component, value) => {
        Object.keys(value).forEach(attr => component.setAttributes({ [attr]: value[attr] }));
    },
    "visibility": (component, value) => {
        component.addStyle({ display: value ? "block" : "none" });
    },
    "backgroundColor": (component, value) => {
        component.addStyle({ "background-color": value });
    },
    "onClick": (component, value) => {
        component.view.el.addEventListener("click", value);
    }
};

/**
 * Applies the node output to the GrapesJS component
 * @param {Object} component - The selected GrapesJS component
 * @param {string} key - The node type (e.g., "text", "style")
 * @param {*} value - The value to be applied
 */
export const applyNodeOutputToComponent = (component, key, value) => {
    if (nodeHandlers[key]) {
        nodeHandlers[key](component, value);
    } else {
        console.warn(`No handler found for node key: ${key}`);
    }
};
