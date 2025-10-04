import mongoose, { Schema } from 'mongoose';
import IPage from '../../types/page.js';
import IProject from '../../types/project.js';

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
    const { default: Project } = await import('./project-schema.js');

    const project = await Project.findById(this.projectId) as IProject;
    await project.updatePageCount();

    next();
})

export default mongoose.model<IPage>('Page', PageSchema);