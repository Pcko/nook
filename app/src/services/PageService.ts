import axios from '../shared/api/httpClient';
import Page from './interfaces/Page.ts';
import PageDTO from './interfaces/PageDTO.ts';
import type { PageMeta } from './interfaces/PageMeta.ts';
import PublishedPage from './interfaces/PublishedPage.ts';
import PublishedPagePageable from './interfaces/PublishedPagePageable.ts';
import { hydrateProjectDataForEditor, prepareProjectDataForPersistence } from './pageContentService.ts';

class PageService {
    /**
     * Parses a PageDTO object into a Page object so the editor can read the state.
     * @param requestPage - The PageDTO object received from the API
     * @returns A Page object with parsed data
     * @private
     */
    private static parsePage(requestPage: PageDTO): Page {
        const data = hydrateProjectDataForEditor(requestPage.data);
        const rawMeta = requestPage.metadata ?? requestPage.pageMeta ?? null;
        let pageMeta: PageMeta | null = null;
        try {
            if (typeof rawMeta === 'string') pageMeta = JSON.parse(rawMeta);
            else if (rawMeta && typeof rawMeta === 'object') pageMeta = rawMeta;
        } catch {
            pageMeta = null;
        }

        return {
            ...requestPage,
            data,
            pageMeta,
        };
    }

    /**
     * Fetches all pages from the API.
     * @returns An array of Page objects
     */
    static async getPages(): Promise<Page[]> {
        const response = await axios.get<PageDTO[]>('/api/pages');
        return response.data.map(this.parsePage);
    }

    /**
     * Fetches a single page from the API by its name.
     * @param pageName - The name of the page to fetch
     * @returns The Page object corresponding to the given name
     */
    static async getPage(pageName: string): Promise<Page> {
        const response = await axios.get<PageDTO>(`/api/pages/${pageName}`);
        return this.parsePage(response.data);
    }

    /**
     * Creates a new page in the API.
     * @param pageName - The name of the page to create
     * @returns The newly created Page object
     */
    static async createPage(pageName: string, metadata: PageMeta = {} as PageMeta): Promise<Page> {
        const response = await axios.post<PageDTO>('/api/pages', { pageName, metadata });
        return this.parsePage(response.data);
    }

    /**
     * Updates the content or name of an existing page.
     * @param page - The Page object that will be updated
     * @param newPageName - Optional new name for the page
     * @returns The updated Page object
     */
    static async updatePage(page: Page, newPageName?: string, preparedContent?: Awaited<ReturnType<typeof prepareProjectDataForPersistence>>): Promise<{ newPageName: string }> {
        const prepared = preparedContent ?? await prepareProjectDataForPersistence(page.name, page.data);
        const payload: any = {
            newPageName,
            pageContent: prepared.serializedData,
        };

        // Only send metadata if present to avoid wiping it accidentally.
        if (page.pageMeta !== undefined && page.pageMeta !== null) {
            payload.metadata = page.pageMeta;
        }

        const response = await axios.patch(`/api/pages/${page.name}`, payload);
        page.data = prepared.editorData;
        return response.data;
    }

    /**
     * Deletes a page from the API by its name.
     */
    static async deletePage(pageName: string): Promise<void> {
        await axios.delete(`/api/pages/${pageName}`);
    }

    static async getPublishedPages(): Promise<PublishedPage[]> {
        const response = await axios<PublishedPagePageable>({
            method: 'get',
            url: (import.meta as any).env.VITE_PUBLISH_URL + '/search/1/25', //temporary, implement frontend paging
            withCredentials: false,
        });

        return response.data.pages;
    }

    /**
     * Semantically searches for published pages based on the user's query.
     *
     * @param query - The user's query.
     * @returns An array of Published Pages
     */
    static async searchPublishedPages(query: string): Promise<PublishedPage[]> {
        const response = await axios.get<PublishedPage[]>(
            `${(import.meta as any).env.VITE_PUBLISH_URL}/search`,
            {
                params: {
                    searchQuery: query,
                },
                withCredentials: false,
            },
        );
        return response.data;
    }
}

export default PageService;
