import mongoose, { Schema } from "mongoose";
import IPageView from "../../types/IPageView.js";

const PageViewSchema = new Schema<IPageView>(
    {
        pageName: {
            type: String,
            required: true,
            index: true,
        },
        publishedPageId: {
            type: Schema.Types.ObjectId,
            ref: "PublishedPage",
            required: true,
            index: true,
        },
        author: {
            type: String,
            ref: "User",
            required: true,
            index: true,
        },
        day: {
            type: String,
            required: true,
            index: true,
        },
        viewedAt: {
            type: Date,
            default: Date.now,
        },
        visitorHash: {
            type: String,
            required: true,
            index: true,
        },
        referrer: {
            type: String,
            default: "",
        },
        userAgent: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: false,
        minimize: false,
    }
);

PageViewSchema.index({ author: 1, pageName: 1, day: 1 });
PageViewSchema.index({ author: 1, day: 1 });
PageViewSchema.index({ publishedPageId: 1, day: 1 });

export const PageView = mongoose.model<IPageView>("PageView", PageViewSchema);
