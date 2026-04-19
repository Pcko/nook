import React from "react";

/**
 * Renders the example image preview component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.src - The src value.
 * @param {any} props.alt - The alt value.
 * @param {any} props.fallbackSrc - The fallback src value.
 * @returns {JSX.Element} The rendered example image preview component.
 */
function ExampleImagePreview({src, alt, fallbackSrc}) {
    const containerRef = React.useRef(null);
    const rafRef = React.useRef(null);
    const [imageSrc, setImageSrc] = React.useState(src);
    const [canScroll, setCanScroll] = React.useState(false);

    React.useEffect(() => {
        setImageSrc(src);
    }, [src]);

    React.useEffect(() => () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        }, []);

    /**
 * Handles the stop animation operation.
 */
    const stopAnimation = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    /**
     *
     * @param targetTop
     * @param duration
     */
    const animateScrollTo = (targetTop, duration = 4500) => {
        const el = containerRef.current;
        if (!el) return;

        stopAnimation();

        const startTop = el.scrollTop;
        const distance = targetTop - startTop;

        if (Math.abs(distance) < 1) return;

        const startTime = performance.now();
        /**
         *
         * @param t
         */
        const easeInOutCubic = (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        /**
         *
         * @param now
         */
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

    /**
 * Updates scrollable state.
 */
    const updateScrollableState = () => {
        requestAnimationFrame(() => {
            const el = containerRef.current;
            if (!el) return;
            const maxScroll = el.scrollHeight - el.clientHeight;
            setCanScroll(maxScroll > 24);
        });
    };

    /**
 * Handles the scroll to bottom operation.
 */
    const scrollToBottom = () => {
        const el = containerRef.current;
        if (!el || !canScroll) return;
        const maxScroll = el.scrollHeight - el.clientHeight;
        animateScrollTo(maxScroll, 5000);
    };

    /**
 * Handles the scroll to top operation.
 */
    const scrollToTop = () => {
        const el = containerRef.current;
        if (!el) return;
        animateScrollTo(0, 700);
    };

    return (
        <div className="relative">
            <div
                aria-label={`${alt} preview`}
                className="h-56 overflow-y-auto border-b border-ui-border bg-ui-bg"
                onBlur={scrollToTop}
                onFocus={scrollToBottom}
                onMouseEnter={scrollToBottom}
                onMouseLeave={scrollToTop}
                ref={containerRef}
                tabIndex={0}
            >
                <img
                    alt={alt}
                    className="block w-full h-auto"
                    onError={() => setImageSrc(fallbackSrc)}
                    onLoad={updateScrollableState}
                    src={imageSrc}
                />
            </div>

        </div>
    );
}

export default ExampleImagePreview;