import { Document, Schema } from 'mongoose';

export default interface IPublishedPage extends Document {
    pageId: Schema.Types.ObjectId;
    name: string;
    html: string;
    assetIds: string[];
    author: string;
    isPublic?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
