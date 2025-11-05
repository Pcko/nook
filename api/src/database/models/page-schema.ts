import mongoose, { Schema } from 'mongoose';
import IPage from '../../types/page.js';

const PageSchema = new Schema<IPage>(
    {
        name: {
            type: String,
            required: true,
        },
        data: {
            type: String,
            default: "",
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
        }
    },
    {
        timestamps: true,
        minimize: false,
    }
);

PageSchema.index({ name: 1, author: 1 }, { unique: true });

export const Page = mongoose.model<IPage>('Page', PageSchema);