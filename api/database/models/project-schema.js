import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        pages: {
            type: Object,
            required: true,
        },
        pageCount: {
            type: Number,
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
        minimize: false,
    }
);

ProjectSchema.index({ name: 1, author: 1 }, { unique: true });

ProjectSchema.pre('save', function (next) {
    this.pageCount = Object.keys(this.project).length;
    next();
})

export default mongoose.model('Project', ProjectSchema);