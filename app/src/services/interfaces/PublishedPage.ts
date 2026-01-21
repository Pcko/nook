import Page from "./Page.ts";

interface PublishedPage {
    page: Page
    name: string;
    html: string;
    author: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default PublishedPage;