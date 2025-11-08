import {Editor} from "grapesjs";
import Page from "./interfaces/Page.ts";
import PageState from "./interfaces/PageState.ts";
import PageService from "./PageService.ts";

class WebsiteBuilderService {

    /** Save editor state to backend */
    static async savePageState(editor: Editor, page: Page): Promise<void> {
        try {
            page.data = new PageState(editor.getComponents().toJSON(), editor.getStyle().toJSON());
            console.log("savePageState", page);
            await PageService.updatePage(page);
        } catch (err) {
            throw Error('Save has failed!');
        }
    }

    /** Load editor state from backend */
    static async loadPageState(editor: Editor, page: Page): Promise<void> {
        try {
            const data: PageState = page.data;
            if (!data)
                return;
            console.log("loadPageState", page);
            editor.setComponents(data.components || []);
            editor.setStyle(data.styles || []);
        } catch (err) {
            console.error(err)
            throw Error('Load has failed!');
        }
    }
}

export default WebsiteBuilderService;