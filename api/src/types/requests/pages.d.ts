import { PageMetadata } from './pageMeta';
import type { StoredStringEncoding } from '../../util/compression.js';

export interface CreatePageBody {
    pageName: string;
    folderName?: string;
    metadata?: PageMetadata;
}

export interface PageNameParam {
    pageName: string;
}

export interface UpdatePageBody {
    newPageName?: string;
    newFolderName?: string;
    pageContent?: string | null;
    dataEncoding?: StoredStringEncoding;
    dataVersion?: number;
    metadata?: PageMetadata;
}
