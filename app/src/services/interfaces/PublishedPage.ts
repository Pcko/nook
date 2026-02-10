interface PublishedPage {
    _id?: string;
    pageId?: string;
    name: string;
    html?: string;
    author: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export default PublishedPage;
