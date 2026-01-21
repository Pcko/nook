import React, {useEffect, useRef, useState} from "react";

function useElementWidth<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [w, setW] = useState(0);

    useEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver((entries) => setW(entries[0].contentRect.width));
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return {ref, w};
}

const Preview = ({
                     k,
                     iframeDoc,
                     isHtmlLoading,
                     iframeErr,
                     onClick = () => undefined
                 }: {
    k: string;
    iframeDoc?: string;
    isHtmlLoading: boolean;
    iframeErr?: string;
    onClick?: () => void;
}) => {
    const DESKTOP_WIDTH = 1200;

    const {ref, w} = useElementWidth<HTMLDivElement>();
    const scale = w ? Math.min(1, w / DESKTOP_WIDTH) : 0.25;

    return (
        <div
            ref={ref}
            className="relative w-full h-56 overflow-hidden rounded-lg border border-ui-border bg-website-bg"
            onClick={onClick}
        >
            {iframeErr ? (
                <div className="p-3 text-sm text-dangerous bg-dangerous-50">{iframeErr}</div>
            ) : iframeDoc ? (
                <iframe
                    title={`preview-${k}`}
                    srcDoc={iframeDoc}
                    sandbox="allow-same-origin"
                    scrolling="no"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        width: `${DESKTOP_WIDTH}px`,
                        height: "2000px",
                        transform: `translateX(-50%) scale(${scale})`,
                        transformOrigin: "top center",
                        border: 0,
                        display: "block",
                        background: "#fff",
                        pointerEvents: "none",
                    }}
                />
            ) : (
                <div className="h-56 flex items-center justify-center text-sm text-text-subtle">
                    {isHtmlLoading ? "Rendering preview..." : "Preview unavailable"}
                </div>
            )}
        </div>
    );
};

export default Preview;
