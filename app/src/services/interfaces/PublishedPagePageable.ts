import PublishedPage from "./PublishedPage.ts";

export default interface PublishedPagePageable {
    pages: PublishedPage[];
    pagination: {
        total: number;
        totalPages: number;
    };
}