/**
 * WebsiteBuilderService
 *
 * Handles all GrapesJS editor state persistence — saving to and loading from
 * both the backend and localStorage cache.
 *
 * @remarks
 * This service fully replaces the old EditorContext-based state management.
 * It ensures GrapesJS project data is always consistent between local and remote sources.
 *
 * @example
 * ```ts
 * await WebsiteBuilderService.savePageState(editor, currentPage);
 * await WebsiteBuilderService.loadPageState(editor, currentPage);
 * ```
 */

import {Editor} from "grapesjs";
import Page from "./interfaces/Page.ts";
import PageService from "./PageService.ts";

class WebsiteBuilderService {
    /**
     * Save the current GrapesJS project state.
     *
     * @param editor - The GrapesJS editor instance
     * @param page - The page object containing metadata and storage info
     * @throws Will throw an error if saving fails
     */
    static async savePageState(editor: Editor, page: Page): Promise<void> {
        try {
            page.data = editor.getProjectData();

            // Cache locally for faster reloads
            localStorage.setItem(`page_${page.name}`, JSON.stringify(page.data));

            // Persist to backend
            await PageService.updatePage(page);
        } catch (err) {
            throw {...err, redirectToLogin: true}
        }
    }

    /**
     * Load the GrapesJS project state for a page.
     *
     * Loads from localStorage first (if available), then falls back to the backend.
     *
     * @param editor - The GrapesJS editor instance
     * @param page - The page object containing metadata and storage info
     * @throws Will throw an error if loading fails
     */
    static async loadPageState(editor: Editor, page: Page): Promise<void> {
        try {
            const storageKey = `page_${page.name}`;

            // Try local cache first
            const cached = localStorage.getItem(storageKey);
            if (cached != null) {
                editor.loadProjectData(JSON.parse(cached));
                return;
            }

            // Fallback: load from backend
            const {data} = await PageService.getPage(page.name);

            if (data == null)
                return

            localStorage.setItem(storageKey, JSON.stringify(data));
            editor.loadProjectData(data);
        } catch (err) {
            throw {...err, redirectToLogin: true}
        }
    }
}

export default WebsiteBuilderService;