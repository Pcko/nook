import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        project: {
            type: Object,
            required: true,
        },
        pageCount: {
            type: Number,
            default: 0,
        },
        author: {
            type: String,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

ProjectSchema.index({ name: 1, author: 1 }, { unique: true });

ProjectSchema.pre('save', function (next) {
    this.pageCount = Object.keys(this.project).length;
    next();
})

export default mongoose.model('Project', ProjectSchema);