import { PageMetadata } from './pageMeta';

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
    metadata?: PageMetadata;
}
