export interface CreatePageBody {
    pageName: string;
    folderName?: string;
}

export interface PageNameParam {
    pageName: string;
}

export interface UpdatePageBody {
    newPageName?: string;
    newFolderName?: string;
    pageContent?: string;
    deploymentStatus?: string;
}