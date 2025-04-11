import mongoose from 'mongoose';

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

export default mongoose.model('Project', PageSchema);