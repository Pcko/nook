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

// remove (document middleware)
ProjectSchema.pre('remove', async function (next) {
    await handleProjectDeletion(this);
    next();
});

ProjectSchema.index({ name: 1, author: 1 }, { unique: true });

ProjectSchema.methods.updatePageCount = async function () {
    const pages = await Page.find({ project: this._id });
    this.pageCount = pages.length;

    await this.save();
}

async function handleProjectDeletion(project) {
    if (!project) return;

    await Page.deleteMany({ projectId: project._id });
}

export default mongoose.model('Project', ProjectSchema);