import mongoose from 'mongoose';
import Page from './page-schema.js';

const { Schema } = mongoose;

const ProjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        pageCount: {
            type: Number,
            default: 0,
            required: true,
        },
        author: {
            type: String,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

ProjectSchema.index({ name: 1, author: 1 }, { unique: true });

ProjectSchema.methods.updatePageCount = async function () {
    const pages = await Page.find({ project: this._id });
    this.pageCount = pages.length;

    await this.save();
}

export default mongoose.model('Project', ProjectSchema);