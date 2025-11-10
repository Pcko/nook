/**
 * @file EditorHub.jsx
 * @description
 * This component acts as the entry point for the GrapesJS website editor.
 * It reads the current page from the React Router location state or URL params,
 * and renders the WebsiteBuilder.
 *
 * Handles:
 * - Redirecting the user if no page data is found
 * - Updating the page when the URL parameter changes
 */

import WebsiteBuilder from "../website-builder/components/WebsiteBuilder";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import user from "../../services/interfaces/User";

/**
 * EditorHub Component
 *
 * @component
 * @returns {JSX.Element} The main editor view for a specific page.
 */
function EditorHub() {
    const {pageName} = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    /** @type {[Page | null, Function]} Page state pulled from router or fallback */
    const [page, setPage] = useState(location.state?.page);

    /**
     * Clears cache for the page so that the WebsiteBuilder doesn't load locally
     * and fetches the actual state from DB
     */
    useEffect(() => {
        localStorage.removeItem(`page_${page.name}`);
    }, [])

    /**
     * Redirects to the homepage if no page data is present.
     */
    useEffect(() => {
        if (!page) {
            navigate('/');
        }
    }, [page, pageName, navigate]);

    /**
     * Updates the editor when the URL parameter changes (e.g., user switches pages).
     * This ensures the correct page is loaded when using navigation links.
     */
    useEffect(() => {
        if (page && pageName !== page.name && location.state?.page) {
            setPage(location.state.page);
        }
    }, [pageName, page, location.state]);

    return (
        <WebsiteBuilder page={page}/>
    );
}

export default EditorHub;
