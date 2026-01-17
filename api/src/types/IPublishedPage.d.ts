import { Document } from 'mongoose';

export default interface IPublishedPage extends Document {
    pageId: string;
    name: string;
    html: string;
    author: string;
    createdAt?: Date;
    updatedAt?: Date;
}
