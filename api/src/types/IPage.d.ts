import { Document } from 'mongoose';
import { PageMetadata } from './requests/pageMeta';
import type { StoredStringEncoding } from '../util/compression.js';

export type DeploymentStatus = 'online' | 'inactive' | 'not deployed';

export default interface IPage extends Document {
    name: string;
    metadata: PageMetadata;
    data: string | null;
    dataEncoding: StoredStringEncoding;
    dataVersion: number;
    author: string;
    folderName: string;
    deploymentStatus: DeploymentStatus;
}
