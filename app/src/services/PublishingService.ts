import Page from "./interfaces/Page.ts";
import {
    buildStaticBundle as buildPublishingBundle,
    openPublishedPage as openPublishedPageByUrl,
    publishPage as publishWebsitePage,
} from "../features/publishing/api/publishingApi";

class PublishingService {
    static publish(page: Page, html: string, isPublic: boolean) {
        return publishWebsitePage(page, html, isPublic);
    }

    static open(authorId: string, pageName: string) {
        return openPublishedPageByUrl(authorId, pageName);
    }

    static async buildStaticBundle(editor: any) {
        return buildPublishingBundle(editor);
    }
}

export default PublishingService;
