import PublishedPage from "./PublishedPage.ts";

export default interface PublishedPagePageable {
    data: PublishedPage[];
    pagination: {
        total: number;
        totalPages: number;
    };
}