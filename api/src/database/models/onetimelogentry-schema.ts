import mongoose, { Schema } from 'mongoose';
import IOneTimeLogEntry from '../../types/IOneTimeLogEntry.js';

export type PipelineStatus = "running" | "success" | "failed";

const OneTimeLogEntrySchema = new Schema<IOneTimeLogEntry>(
    {
        database: {
            type: String,
            required: true,
        },
        oneTimeIteration: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["running", "success", "failed"],
            required: true,
            index: true,
        },
        description: {
            type: String,
        },
        startedAt: {
            type: Date,
            default: new Date(),
            required: true,
            immutable: true,
        },
        finishedAt: {
            type: Date,
        },
    },
    {
        timestamps: false,
    }
);

OneTimeLogEntrySchema.index({
    database: 1,
    status: 1,
    finishedAt: -1
});

export const OneTimeLogEntry = mongoose.model<IOneTimeLogEntry>('OneTimeLogEntry', OneTimeLogEntrySchema);