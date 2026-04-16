import type Page from '../../../services/interfaces/Page.ts';
import httpClient from '../../../shared/api/httpClient';
import { grapesjsExportConfig } from '../../../components/website-builder/utils/grapesExportConfig';
import { getWebsiteExportSettings } from '../../../components/website-builder/utils/websiteExportSettings';
import { encodeStoredString } from '../../../services/pageContentService.ts';

const axiosConfig = {
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000,
    timeoutErrorMessage: 'Server did not respond.',
};

export function publishPage(page: Page, html: string, isPublic: boolean) {
    const encodedHtml = encodeStoredString(html);
    return httpClient.post(
        `/api/publishPage/${page.name}/${page.name}`,
        {
            page: encodedHtml.content,
            pageEncoding: encodedHtml.encoding,
            pageVersion: encodedHtml.version,
            isPublic,
        },
        axiosConfig,
    );
}

export function openPublishedPage(authorId: string, pageName: string) {
    return httpClient({
        method: 'get',
        url: `${(import.meta as any).env.VITE_PUBLISH_URL}/${encodeURIComponent(authorId)}/${encodeURIComponent(pageName)}`,
    });
}

export async function buildStaticBundle(editor: any) {
    const htmlFn = grapesjsExportConfig?.root?.['index.html'];
    const cssFn = grapesjsExportConfig?.root?.css?.['style.css'];
    const imgFn = grapesjsExportConfig?.root?.img;

    if (!htmlFn || !cssFn || !imgFn) {
        throw new Error('Export configuration is missing required handlers.');
    }

    const [htmlRaw, css, imgBinaryMap] = await Promise.all([
        htmlFn(editor),
        Promise.resolve(cssFn(editor)),
        imgFn(editor),
    ]);

    let html = htmlRaw;

    const styleTag = `<style>\n${css}\n</style>`;
    if (html.includes('</head>')) {
        html = html.replace('</head>', `${styleTag}\n</head>`);
    } else {
        html = `${styleTag}\n${html}`;
    }

    const imageDataUrlMap: Record<string, string> = {};

    for (const [filename, binary] of Object.entries(imgBinaryMap || {})) {
        const mime = (() => {
            const ext = filename.split('.').pop()?.toLowerCase();
            switch (ext) {
                case 'png':
                    return 'image/png';
                case 'jpg':
                case 'jpeg':
                    return 'image/jpeg';
                case 'gif':
                    return 'image/gif';
                case 'svg':
                    return 'image/svg+xml';
                case 'webp':
                    return 'image/webp';
                default:
                    return 'application/octet-stream';
            }
        })();

        const base64 = btoa(binary);
        imageDataUrlMap[`img/${filename}`] = `data:${mime};base64,${base64}`;
    }

    for (const [path, dataUrl] of Object.entries(imageDataUrlMap)) {
        const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(["'])${escapedPath}\\1`, 'g');
        html = html.replace(regex, `$1${dataUrl}$1`);
    }

    return {
        html,
        projectData: editor.getProjectData(),
        exportSettings: getWebsiteExportSettings(),
    };
}

const publishingApi = {
    publishPage,
    openPublishedPage,
    buildStaticBundle,
};

export default publishingApi;
