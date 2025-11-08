import axios from "../components/auth/AxiosInstance";
import Page from "./interfaces/Page.ts";
import RequestPage from "./interfaces/RequestPage.ts";
import PageState from "./interfaces/PageState.ts";

class PageService {

    static async updatePage(page: Page, newPageName?: string): Promise<Page> {
        const response = await axios.patch(`/api/pages/${page.name}`, {
            newPageName: newPageName,
            newFolderName: undefined,
            pageContent: JSON.stringify(page.data),
        });
        return response.data;
    }

    static async deletePage(pageName: string): Promise<void> {
        return await axios.delete(`/api/pages/${pageName}`);
    }

    static async createPage(pageName: string): Promise<Page> {
        const response = await axios.post(`/api/pages`, {pageName: pageName, folderName: "default"})
        return response.data;
    }

    static async getPages(): Promise<Page[]> {
        const response = await axios.get(`/api/pages`);
        const pages: Page[] = [];

        // Page from Request saves state as string
        response.data.forEach((requestPage: RequestPage) => {
            const rawState = JSON.parse(requestPage.data !== '' ? requestPage.data : '{"components": [],"styles": []}');
            const pageState: PageState = new PageState(rawState.components, rawState.styles);
            const page: Page = {...requestPage, data: pageState}

            pages.push(page)
        });

        return pages;
    }
}




export default PageService;