import type { StoredStringEncoding } from '../../util/compression.js';

export interface PublishPageBody {
    page: string;
    pageEncoding?: StoredStringEncoding;
    pageVersion?: number;
    isPublic?: boolean;
}

export interface PublishPageParams {
    pageName: string;
    displayPageName: string;
}
