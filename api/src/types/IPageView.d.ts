import { Document } from "mongoose";

export default interface IPageView extends Document {
    pageName: string;
    publishedPageId: Schema.Types.ObjectId;
    author: string;
    day: string;
    viewedAt: Date;
    visitorHash: string;
    referrer?: string;
    userAgent?: string;
}
