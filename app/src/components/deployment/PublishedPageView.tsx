import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axiosInstance from "../auth/AxiosInstance";

function PublishedPageView() {
    const {authorId, pageName} = useParams();
    const [html, setHtml] = useState("");
    const [err, setErr] = useState("");

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setErr("");
                const res = await axiosInstance.get(`/api/published/${encodeURIComponent(authorId)}/${encodeURIComponent(pageName)}`, {
                    responseType: "text",
                    transformResponse: (r) => r, // keep raw string
                });
                if (!mounted) return;
                setHtml(res.data);
            } catch (e) {
                if (!mounted) return;
                setErr("Page not found.");
            }
        })();

        return () => {
            mounted = false;
        };
    }, [authorId, pageName]);

    if (err) {
        return <div className="p-6 text-text">{err}</div>;
    }

    return (
        <iframe
            title={pageName}
            className="w-full h-screen border-0"
            srcDoc={html}
            sandbox="allow-same-origin allow-forms allow-scripts allow-popups"
        />
    );
}

export default PublishedPageView;