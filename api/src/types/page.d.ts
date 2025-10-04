import { Schema, Document } from 'mongoose';

export default interface IPage extends Document {
    name: string;
    data: string;
    projectId: Schema.Types.ObjectId;
    folderName: string;
}