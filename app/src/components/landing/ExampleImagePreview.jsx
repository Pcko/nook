import React from "react";

function ExampleImagePreview({src, alt, fallbackSrc}) {
    const containerRef = React.useRef(null);
    const rafRef = React.useRef(null);
    const [imageSrc, setImageSrc] = React.useState(src);
    const [canScroll, setCanScroll] = React.useState(false);

    React.useEffect(() => {
        setImageSrc(src);
    }, [src]);

    React.useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const stopAnimation = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    const animateScrollTo = (targetTop, duration = 4500) => {
        const el = containerRef.current;
        if (!el) return;

        stopAnimation();

        const startTop = el.scrollTop;
        const distance = targetTop - startTop;

        if (Math.abs(distance) < 1) return;

        const startTime = performance.now();
        const easeInOutCubic = (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            el.scrollTop = startTop + distance * easeInOutCubic(progress);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(step);
            } else {
                rafRef.current = null;
            }
        };

        rafRef.current = requestAnimationFrame(step);
    };

    const updateScrollableState = () => {
        requestAnimationFrame(() => {
            const el = containerRef.current;
            if (!el) return;
            const maxScroll = el.scrollHeight - el.clientHeight;
            setCanScroll(maxScroll > 24);
        });
    };

    const scrollToBottom = () => {
        const el = containerRef.current;
        if (!el || !canScroll) return;
        const maxScroll = el.scrollHeight - el.clientHeight;
        animateScrollTo(maxScroll, 5000);
    };

    const scrollToTop = () => {
        const el = containerRef.current;
        if (!el) return;
        animateScrollTo(0, 700);
    };

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="h-56 overflow-y-auto border-b border-ui-border bg-ui-bg"
                onMouseEnter={scrollToBottom}
                onMouseLeave={scrollToTop}
                onFocus={scrollToBottom}
                onBlur={scrollToTop}
                tabIndex={0}
                aria-label={`${alt} preview`}
            >
                <img
                    src={imageSrc}
                    alt={alt}
                    className="block w-full h-auto"
                    onLoad={updateScrollableState}
                    onError={() => setImageSrc(fallbackSrc)}
                />
            </div>

        </div>
    );
}

export default ExampleImagePreview;