import { Editor } from 'grapesjs';
import Page from './interfaces/Page.ts';
import PageService from './PageService.ts';
import {
    prepareProjectDataForPersistence,
    restoreProjectDataFromCache,
    writePageCache,
} from './pageContentService.ts';

class WebsiteBuilderService {
    static async savePageState(editor: Editor, page: Page): Promise<void> {
        const storageKey = `page_${page.name}`;

        try {
            const latestProjectData = editor.getProjectData();
            const prepared = await prepareProjectDataForPersistence(page.name, latestProjectData);

            page.data = prepared.editorData;
            await PageService.updatePage(page, undefined, prepared);
            localStorage.removeItem(storageKey);
        } catch (err) {
            const latestProjectData = editor.getProjectData();
            const prepared = await prepareProjectDataForPersistence(page.name, latestProjectData);
            writePageCache(storageKey, prepared.normalizedData);
            throw { ...err, redirectToLogin: true };
        }
    }

    static async loadPageState(editor: Editor, page: Page): Promise<void> {
        const storageKey = `page_${page.name}`;

        try {
            const { data } = await PageService.getPage(page.name);
            if (data !== null) {
                page.data = data;
                editor.loadProjectData(data);
            }
        } catch (err) {
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

            throw { ...err, redirectToLogin: true };
        }
    }
}

export default WebsiteBuilderService;
