import axios from "../components/auth/AxiosInstance";
import Page from "./interfaces/Page.ts";
import PageDTO from "./interfaces/PageDTO.ts";

class PageService {

    static async updatePage(page: Page, newPageName?: string): Promise<Page> {
        const response = await axios.patch(`/api/pages/${page.name}`, {
            newPageName: newPageName,
            pageContent: JSON.stringify(page.data),
        });
        return response.data;
    }

    static async deletePage(pageName: string): Promise<void> {
        return await axios.delete(`/api/pages/${pageName}`);
    }

    static async createPage(pageName: string): Promise<Page> {
        const response = await axios.post(`/api/pages`, {pageName: pageName})
        return response.data;
    }

    static async getPages(): Promise<Page[]> {
        const response = await axios.get(`/api/pages`);
        const pages: Page[] = [];

        response.data.forEach((requestPage: PageDTO) => {
            const projectState = JSON.parse(requestPage.data !== '' ? requestPage.data : '{}');
            const page: Page = {...requestPage, data: projectState}

            pages.push(page)
        });

        return pages;
    }

    static async getPage(pageName: string): Promise<Page> {
        const response = await axios.get(`/api/pages/${pageName}`);
        const requestPage: PageDTO = response.data;
        const projectState = JSON.parse(requestPage.data !== '' ? requestPage.data : '{}');

        return {...requestPage, data: projectState};
    }
}


export default PageService;