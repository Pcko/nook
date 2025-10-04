import mongoose, { Schema } from 'mongoose';
import Page from './page-schema.js';
import IProject from '../../types/project.js';

const ProjectSchema = new Schema<IProject>(
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

async function handleProjectDeletion(project: IProject | null) {
    if (!project) return;

    await Page.deleteMany({ projectId: project._id });
}

ProjectSchema.methods.updatePageCount = async function () {
    const pages = await Page.find({ project: this._id });
    this.pageCount = pages.length;

    await this.save();
}

// findOneAndDelete (also covers findByIdAndDelete)
ProjectSchema.pre('findOneAndDelete', async function (next) {
    const project = await this.model.findOne(this.getFilter());
    await handleProjectDeletion(project);
    next();
});

// deleteOne (query middleware)
ProjectSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const project = await this.model.findOne(this.getFilter());
    await handleProjectDeletion(project);
    next();
});

// deleteMany (bulk deletion)
ProjectSchema.pre('deleteMany', async function (next) {
    const projects = await this.model.find(this.getFilter());
    for (const project of projects) {
        await handleProjectDeletion(project);
    }
    next();
});

export default mongoose.model<IProject>('Project', ProjectSchema);