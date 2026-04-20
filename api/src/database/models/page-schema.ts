import mongoose, { Schema } from 'mongoose';
import IPage from '../../types/IPage.js';
import { PublishedPage } from './publishedPage-schema.js';

const PageSchema = new Schema<IPage>(
    {
        name: {
            type: String,
            required: true,
            maxLength: 50,
        },
        metadata: {
            type: Object,
            default: {},
        },
        data: {
            type: String,
            default: null,
        },
        author: {
            type: String,
            ref: 'User',
            required: true,
        },
        folderName: {
            type: String,
            required: true,
            default: 'General',
        },
        deploymentStatus: {
            type: String,
            required: true,
            enum: ['online', 'inactive', 'not deployed'],
            default: 'not deployed',
        },
    },
    {
        timestamps: true,
        minimize: false,
    },
);

async function handlePageDeletion(page: IPage | null) {
    if (!page) return;

    await PublishedPage.findOneAndDelete({ pageId: page._id, author: page.author });
}

// findOneAndDelete (also covers findByIdAndDelete)
PageSchema.pre('findOneAndDelete', async function (next) {
    const page = await this.model.findOne(this.getFilter());
    await handlePageDeletion(page);
    next();
});

// deleteOne (query middleware)
PageSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const page = await this.model.findOne(this.getFilter());
    await handlePageDeletion(page);
    next();
});

// deleteMany (bulk deletion)
PageSchema.pre('deleteMany', async function (next) {
    const pages = await this.model.find(this.getFilter());
    for (const page of pages) {
        await handlePageDeletion(page);
    }
    next();
});

PageSchema.index({ name: 1, author: 1 }, { unique: true });

export const Page = mongoose.model<IPage>('Page', PageSchema);
