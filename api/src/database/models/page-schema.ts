import mongoose, { Schema } from 'mongoose';
import IPage from '../../types/IPage.js';

const PageSchema = new Schema<IPage>(
    {
        name: {
            type: String,
            required: true,
            maxLength: 50,
        },
        metadata: {
            type: Object,
            default: {}
        },
        data: {
            type: String,
            default: null,
        },
        author: {
            type: String,
            ref: "User",
            required: true,
        },
        folderName: {
            type: String,
            required: true,
            default: "General",
        },
        deploymentStatus: {
            type: String,
            required: true,
            default: "not deployed",
        },
    },
    {
        timestamps: true,
        minimize: false,
    }
);

PageSchema.index({ name: 1, author: 1 }, { unique: true });

export const Page = mongoose.model<IPage>('Page', PageSchema);