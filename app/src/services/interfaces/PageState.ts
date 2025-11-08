import {Components, CssRules} from "grapesjs";

class PageState {
    public components: Components;
    public styles: CssRules

    constructor(components: Components, styles: CssRules) {
        this.components = components;
        this.styles = styles;
    }
}

export default PageState;