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
        const latestProjectData = editor.getProjectData();
        const prepared = await prepareProjectDataForPersistence(page.name, latestProjectData);
        const storageKey = `page_${page.name}`;

        page.data = prepared.editorData;

        try {
            await PageService.updatePage(page, undefined, prepared);

            // save was successful no draft should survive refresh
            localStorage.removeItem(storageKey);
        } catch (err) {
            // keep a recovery draft only when save failed
            writePageCache(storageKey, prepared.normalizedData);
            throw { ...err, redirectToLogin: true };
        }
    }

    static async loadPageState(editor: Editor, page: Page): Promise<void> {
        const storageKey = `page_${page.name}`;

        try {
            const serverPage = await PageService.getPage(page.name);

            page.data = serverPage.data;
            editor.loadProjectData(serverPage.data ?? {});
        } catch (err) {
            // fallback only if server load fails
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