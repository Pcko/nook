import { Schema, Document } from 'mongoose';

export default interface IPage extends Document {
    name: string;
    data: string;
    author: string;
    folderName: string;
}