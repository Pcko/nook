import { Document } from "mongoose";

export default interface IPageView extends Document {
    pageName: string;
    pageId?: string;
    publishedPageId?: string;
    author: string;
    day: string;
    viewedAt: Date;
    visitorHash: string;
    referrer?: string;
    userAgent?: string;
}
