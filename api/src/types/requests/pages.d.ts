import {PageMetadata} from "../IPage";

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
    pageContent?: string;
    metadata?: PageMetadata;
}

export interface PageMetadata {
    language?: string;
    industry?: string;
    websiteGoal?: string;
    brandName?: string;
    tagline?: string;
    tone?: string;
    keywords?: string[];
    services?: string;
    ctaText?: string;
    email?: string;
    phone?: string;
    location?: string;
    dos?: string;
    donts?: string;
    audienceType?: string;
    audienceRegion?: string;
    audienceNotes?: string;
}