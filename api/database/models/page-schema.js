import mongoose from 'mongoose';
import Project from './project-schema.js';

const { Schema } = mongoose;

const PageSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        data: {
            type: Object,
            required: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
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

PageSchema.index({ name: 1, projectId: 1 }, { unique: true });

PageSchema.pre('save', async function (next) {
    const project = await Project.findById(this.projectId);
    await project.updatePageCount;

    next();
})

export default mongoose.model('Page', PageSchema);