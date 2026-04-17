import { Document } from 'mongoose';
import { PageMetadata } from './requests/pageMeta';

export type DeploymentStatus = 'online' | 'inactive' | 'not deployed';

export default interface IPage extends Document {
    name: string;
    metadata: PageMetadata;
    data: string | null;
    author: string;
    folderName: string;
    deploymentStatus: DeploymentStatus;
}
