import mongoose, { Schema } from 'mongoose';
import IPageAsset from '../../types/IPageAsset.js';

const PageAssetSchema = new Schema<IPageAsset>(
    {
        author: {
            type: String,
            ref: 'User',
            required: true,
            index: true,
        },
        hash: {
            type: String,
            required: true,
        },
        contentType: {
            type: String,
            required: true,
            default: 'application/octet-stream',
        },
        byteSize: {
            type: Number,
            required: true,
            min: 0,
        },
        data: {
            type: Buffer,
            required: true,
        },
    },
    {
        timestamps: true,
        minimize: false,
    },
);

PageAssetSchema.index({ author: 1, hash: 1 }, { unique: true });

export const PageAsset = mongoose.model<IPageAsset>('PageAsset', PageAssetSchema);
