import axios from "../components/auth/AxiosInstance";
import axiosInstance from "../components/auth/AxiosInstance";
import Page from "./interfaces/Page.ts";
import {grapesjsExportConfig} from "../components/website-builder/utils/grapesExportConfig";
import {getWebsiteExportSettings} from "../components/website-builder/utils/websiteExportSettings";

const axiosConfig = {
    headers: {'Content-Type': 'application/json'},
    timeout: 5000,
    timeoutErrorMessage: 'Server did not respond.',
};

class PublishingService {

    static publish(page: Page, html: string) {
        return axios.post(
            `/api/publishPage/${page.name}`,
            {page: html},
            axiosConfig
        );
    }

    static open(authorId: string, pageName: string) {
       return axiosInstance.get(`/api/published/${encodeURIComponent(authorId)}/${encodeURIComponent(pageName)}`, {
            responseType: "text",
            transformResponse: (r) => r, // keep raw string
        })
    }

    static async buildStaticBundle(editor) {
        const htmlFn = grapesjsExportConfig?.root?.["index.html"];
        const cssFn = grapesjsExportConfig?.root?.css?.["style.css"];
        const imgFn = grapesjsExportConfig?.root?.img;

        if (!htmlFn || !cssFn || !imgFn) {
            throw new Error("Export configuration is missing required handlers.");
        }

        const [html, css, imgBinaryMap] = await Promise.all([
            htmlFn(editor),
            Promise.resolve(cssFn(editor)),
            imgFn(editor),
        ]);

        const assets = Object.entries(imgBinaryMap || {}).map(([filename, binary]) => ({
            path: `img/${filename}`,
            base64: btoa(binary),
        }));

        return {
            html,
            css,
            assets,
            projectData: editor.getProjectData(),
            exportSettings: getWebsiteExportSettings(),
        };
    }

}

export default PublishingService;