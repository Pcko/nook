import axios from "../components/auth/AxiosInstance";
import Page from "./interfaces/Page.ts";
import PageDTO from "./interfaces/PageDTO.ts";

class PageService {
    /**
     * Parses a PageDTO object into a Page object so the editor can read the state.
     * @param requestPage - The PageDTO object received from the API
     * @returns A Page object with parsed data
     * @private
     */
    private static parsePage(requestPage: PageDTO): Page {
        return {...requestPage, data: requestPage.data === null ? null : JSON.parse(requestPage.data)};
    }

    /**
     * Fetches all pages from the API.
     * @returns An array of Page objects
     */
    static async getPages(): Promise<Page[]> {
        const response = await axios.get<PageDTO[]>("/api/pages");

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
    static async createPage(pageName: string): Promise<Page> {
        const response = await axios.post<PageDTO>("/api/pages", {pageName});
        return this.parsePage(response.data);
    }

    /**
     * Updates the content or name of an existing page.
     * @param page - The Page object that will be updated
     * @param newPageName - Optional new name for the page
     * @returns The updated Page object
     */
    static async updatePage(page: Page, newPageName?: string): Promise<{ newPageName: string }> {
        const payload = {
            newPageName,
            pageContent: JSON.stringify(page.data),
        };

        const response = await axios.patch(`/api/pages/${page.name}`, payload);
        return response.data;
    }

    /**
     * Deletes a page from the API by its name.
     * @param pageName - The name of the page to delete
     */
    static async deletePage(pageName: string): Promise<void> {
        await axios.delete(`/api/pages/${pageName}`);
    }
}

export default PageService;