import { Document } from 'mongoose';

export default interface IPageAsset extends Document {
    author: string;
    hash: string;
    contentType: string;
    byteSize: number;
    data: Buffer;
    createdAt?: Date;
    updatedAt?: Date;
}
