import {ProjectData} from "grapesjs";

/**
 * Represents a website page managed by the WebsiteBuilder.
 *
 * @property name - The unique name of the page.
 * @property createdAt - Timestamp when the page was created.
 * @property updatedAt - Timestamp of the last update.
 * @property deploymentStatus - Current publishing/deployment status.
 * @property data - The GrapesJS project data for this page.
 */
interface Page {
    name: string;
    createdAt: string;
    updatedAt: string;
    deploymentStatus: string;
    data: ProjectData;
}

export default Page;