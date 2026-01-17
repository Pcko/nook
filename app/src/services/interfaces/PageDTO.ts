/**
 * @file PageDTO.ts
 * @description
 * Represents a page object used for API communication with the backend.
 *
 * @property {string} name - The unique name of the page
 * @property {string} createdAt - ISO timestamp when the page was created
 * @property {string} updatedAt - ISO timestamp when the page was last updated
 * @property {string} deploymentStatus - Deployment status (e.g., 'draft', 'published', 'error')
 * @property {string} data - GrapesJS project data serialized as a JSON string
 * @property {any} [metadata] - page meta stored in the DB (object)
 * @property {string} [pageMeta] - legacy page meta JSON string (older frontend)
 */
class PageDTO {
    name: string;
    createdAt: string;
    updatedAt: string;
    deploymentStatus: string;
    data: string | null;
    metadata?: any;
    pageMeta: string | null;
}

export default PageDTO;
