import { Document } from 'mongoose';

export default interface IOneTimeLogEntry extends Document {
    database: string;
    oneTimeIteration: Number;
    status: string;
    description: string;
    startedAt: Date;
    finishedAt?: Date;
}