import { Document } from 'mongoose';

export default interface IPublishedPage extends Document {
    name: string;
    html: string;
    author: string;
}