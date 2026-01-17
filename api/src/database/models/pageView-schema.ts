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
            default: Date.now(),
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

export const PageView = mongoose.model<IPageView>("PageView", PageViewSchema);
