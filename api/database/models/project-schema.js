import mongoose from 'mongoose';
import Page from '../models/page-schema.js';

const { Schema } = mongoose;

const ProjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        pageCount: {
            type: Number,
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

ProjectSchema.pre('save', async function (next) {
    const pages = await Page.find({ project: this._id });

    this.pageCount = pages.length;
    next();
})

export default mongoose.model('Project', ProjectSchema);