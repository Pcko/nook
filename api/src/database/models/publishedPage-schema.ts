import mongoose, { Schema } from 'mongoose';
import IPublishedPage from '../../types/IPublishedPage.js';
import { PageView } from './pageView-schema.js';

const PublishedPageSchema = new Schema<IPublishedPage>(
    {
        pageId: {
            type: Schema.Types.ObjectId,
            ref: "Page",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            maxLength: 50,
        },
        html: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            ref: "User",
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
        minimize: false,
    }
);

async function handlePublishedPageDeletion(publishedPage: IPublishedPage | null) {
    if (!publishedPage) return;

    await PageView.deleteMany({ publishedPageId: publishedPage._id });
}

// findOneAndDelete (also covers findByIdAndDelete)
PublishedPageSchema.pre('findOneAndDelete', async function (next) {
    const publishedPage = await this.model.findOne(this.getFilter());
    await handlePublishedPageDeletion(publishedPage);
    next();
});

// deleteOne (query middleware)
PublishedPageSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const publishedPage = await this.model.findOne(this.getFilter());
    await handlePublishedPageDeletion(publishedPage);
    next();
});

// deleteMany (bulk deletion)
PublishedPageSchema.pre('deleteMany', async function (next) {
    const publishedPages = await this.model.find(this.getFilter());
    for (const publishedPage of publishedPages) {
        await handlePublishedPageDeletion(publishedPage);
    }
    next();
});

PublishedPageSchema.index({ name: 1, author: 1 }, { unique: true });

export const PublishedPage = mongoose.model<IPublishedPage>('PublishedPage', PublishedPageSchema);
