import axios from "../components/auth/AxiosInstance";
import Page from "./interfaces/Page.ts";

class DashboardService {
    static async updatePage(selectedProjectId: string, pageName: string, newPageName: string, trimmedFolderName: string, pages: Page) {
        return await axios.patch(`/api/projects/${selectedProjectId}/pages/${pageName}`,
            {
                newPageName: newPageName === pageName ? undefined : newPageName,
                newFolderName: trimmedFolderName === pages[pageName].folderName ? undefined : trimmedFolderName,
            });
    }

    static async deletePage(pageName) {
        return axios.delete(`/api/pages/${pageName}`);
    }

    static async createPage(selectedProjectId: string, pageName: string, trimmedFolderName: string) {
        return await axios.post(`/api/projects/${selectedProjectId}/pages`, {pageName, folderName: trimmedFolderName});
    }
}

export default DashboardService;