import WebsiteBuilder from "../website-builder/components/WebsiteBuilder";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {EditorProvider} from "./EditorContext";
import {useEffect, useState} from "react";

function EditorHub() {
    const {pageName} = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [page, setPage] = useState(location.state?.page);

    useEffect(() => {
        if (!page) {s
            navigate('/');
        }
    }, [pageName, navigate]);

    useEffect(() => {
        if (pageName !== page.name) {
            setPage(location.state.page);
        }
    }, [pageName]);

    return (
        <EditorProvider>
            <WebsiteBuilder page={page}/>
        </EditorProvider>
    );
}

export default EditorHub;
