import { Document, Schema } from 'mongoose';
import type { StoredStringEncoding } from '../util/compression.js';

export default interface IPublishedPage extends Document {
    pageId: Schema.Types.ObjectId;
    name: string;
    html: string;
    htmlEncoding: StoredStringEncoding;
    htmlVersion: number;
    assetIds: string[];
    author: string;
    isPublic?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
