import mongoose, { Schema } from 'mongoose';
import IPublishedPage from '../../types/IPublishedPage.js';

const PublishedPageSchema = new Schema<IPublishedPage>(
    {
        name: {
            type: String,
            required: true,
            maxLength: 50,
        },
        html: {
            type: String,
            default: null,
        },
        author: {
            type: String,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
        minimize: false,
    }
);

PublishedPageSchema.index({ name: 1, author: 1 }, { unique: true });

export const PublishedPage = mongoose.model<IPublishedPage>('PublishedPage', PublishedPageSchema);