import { Editor } from 'grapesjs';
import Page from './interfaces/Page.ts';
import PageService from './PageService.ts';
import {
    prepareProjectDataForPersistence,
    restoreProjectDataFromCache,
    writeCompressedPageCache,
} from './pageContentService.ts';

class WebsiteBuilderService {
    static async savePageState(editor: Editor, page: Page): Promise<void> {
        try {
            const latestProjectData = editor.getProjectData();
            const prepared = await prepareProjectDataForPersistence(page.name, latestProjectData);
            const storageKey = `page_${page.name}`;

            page.data = prepared.editorData;
            writeCompressedPageCache(storageKey, prepared.normalizedData);

            await PageService.updatePage(page, undefined, prepared);
        } catch (err) {
            throw { ...err, redirectToLogin: true };
        }
    }

    static async loadPageState(editor: Editor, page: Page): Promise<void> {
        try {
            const storageKey = `page_${page.name}`;
            const cached = localStorage.getItem(storageKey);
            if (cached !== null) {
                const restored = restoreProjectDataFromCache(cached);
                if (restored !== null) {
                    page.data = restored;
                    editor.loadProjectData(restored);
                    return;
                }

                localStorage.removeItem(storageKey);
            }

            const { data } = await PageService.getPage(page.name);
            if (data === null) return;

            page.data = data;
            editor.loadProjectData(data);
        } catch (err) {
            throw { ...err, redirectToLogin: true };
        }
    }
}

export default WebsiteBuilderService;
