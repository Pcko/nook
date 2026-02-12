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
            `/api/publishPage/${page.name}/${page.name}`, //WIP: change second one to published displayname
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

        const [htmlRaw, css, imgBinaryMap] = await Promise.all([
            htmlFn(editor),
            Promise.resolve(cssFn(editor)),
            imgFn(editor),
        ]);

        let html = htmlRaw;

        // inject CSS into head
        const styleTag = `<style>\n${css}\n</style>`;
        if (html.includes("</head>")) {
            html = html.replace("</head>", `${styleTag}\n</head>`);
        } else {
            html = `${styleTag}\n${html}`;
        }

        // format images
        const imageDataUrlMap: Record<string, string> = {};

        for (const [filename, binary] of Object.entries(imgBinaryMap || {})) {
            const mime = (() => {
                const ext = filename.split('.').pop()?.toLowerCase();
                switch (ext) {
                    case 'png': return 'image/png';
                    case 'jpg':
                    case 'jpeg': return 'image/jpeg';
                    case 'gif': return 'image/gif';
                    case 'svg': return 'image/svg+xml';
                    case 'webp': return 'image/webp';
                    default: return 'application/octet-stream';
                }
            })();

            const base64 = btoa(binary);
            imageDataUrlMap[`img/${filename}`] = `data:${mime};base64,${base64}`;
        }

        // insert base64 image strings into html
        for (const [path, dataUrl] of Object.entries(imageDataUrlMap)) {
            // replace src="img/foo.png" and src='img/foo.png'
            const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(`(["'])${escapedPath}\\1`, "g");
            html = html.replace(regex, `$1${dataUrl}$1`);
        }

        return {
            html,
            projectData: editor.getProjectData(),
            exportSettings: getWebsiteExportSettings(),
        };
    }

}

export default PublishingService;
