import { Document } from 'mongoose';

export default interface IProject extends Document {
    name: string;
    pageCount: number;
    author: string;
    updatePageCount: () => Promise<void>;
}