import {Document} from 'mongoose';
import {PageMetadata} from "./requests/pages";

export default interface IPage extends Document {
    name: string;
    metadata: PageMetadata;
    data: string;
    author: string;
    folderName: string;
    deploymentStatus: string;
}
