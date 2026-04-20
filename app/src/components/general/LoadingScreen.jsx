import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Provides the use prefers reduced motion hook.
 */
function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        /**
 * Updates preference.
 */
        const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

        updatePreference();

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", updatePreference);
            return () => mediaQuery.removeEventListener("change", updatePreference);
        }

        mediaQuery.addListener(updatePreference);
        return () => mediaQuery.removeListener(updatePreference);
    }, []);

    return prefersReducedMotion;
}

/**
 * Renders the loading bubble component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.className - The class name value.
 * @param {any} props.title - The title value.
 * @param {any} props.subtitle - The subtitle value.
 * @param {any} props.compact - The compact value.
 * @returns {JSX.Element} The rendered loading bubble component.
 */
export function LoadingBubble({
    className = "",
    title = "Loading your workspace",
    subtitle = "Hang tight while we pull everything together.",
    compact = false,
}) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const ringSize = compact ? "h-16 w-16" : "h-20 w-20";
    const padding = compact ? "p-5" : "p-8";
    const titleClass = compact ? "text-h5" : "text-h4";
    const subtitleClass = compact ? "text-tiny" : "text-small";
    const barWidth = compact ? "max-w-[200px]" : "max-w-[260px]";
    const floatAnimation = prefersReducedMotion || compact ? {} : { y: [0, -4, 0] };
    const floatTransition = prefersReducedMotion || compact
        ? {}
        : { duration: 2.8, repeat: Infinity, ease: "easeInOut" };
    const spinAnimation = prefersReducedMotion ? {} : { rotate: 360 };
    const spinTransition = prefersReducedMotion
        ? {}
        : { duration: 1.1, repeat: Infinity, ease: "linear" };
    const pulseAnimation = prefersReducedMotion ? {} : { scale: [0.92, 1, 0.92], opacity: [0.4, 0.8, 0.4] };
    const pulseTransition = prefersReducedMotion
        ? {}
        : { duration: 1.6, repeat: Infinity, ease: "easeInOut" };
    const dotPulseAnimation = prefersReducedMotion ? {} : { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] };
    const dotPulseTransition = prefersReducedMotion
        ? {}
        : { duration: 1.3, repeat: Infinity, ease: "easeInOut" };
    const sweepAnimation = prefersReducedMotion ? {} : { x: ["-10%", "10%"] };
    const sweepTransition = prefersReducedMotion
        ? {}
        : { duration: 3.2, repeat: Infinity, ease: "easeInOut" };
    const barAnimation = prefersReducedMotion ? {} : { backgroundPosition: ["0% 0%", "200% 0%"] };
    const barTransition = prefersReducedMotion
        ? {}
        : { duration: 2.4, repeat: Infinity, ease: "linear" };

    return (
        <motion.div
            animate={floatAnimation}
            aria-busy="true"
            aria-live="polite"
            className={`relative overflow-hidden rounded-[16px] border border-ui-border bg-ui-bg shadow-sm ${padding} ${className}`}
            role="status"
            transition={floatTransition}
        >
            <div className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-primary opacity-10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-ui-border opacity-30 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ui-border/40 via-transparent to-transparent" />
            <motion.div
                animate={sweepAnimation}
                className="pointer-events-none absolute -left-1/2 top-14 h-8 w-[200%] bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                transition={sweepTransition}
            />

            <div className="relative flex flex-col items-center text-center">
                <div className={`relative ${ringSize}`}>
                    <div className="absolute inset-0 rounded-full border border-ui-border opacity-60" />
                    <motion.div
                        animate={spinAnimation}
                        className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
                        transition={spinTransition}
                    />
                    <motion.div
                        animate={spinAnimation}
                        className="absolute inset-0"
                        transition={prefersReducedMotion ? {} : { duration: 6, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute left-1/2 -top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-primary/70 shadow-sm" />
                    </motion.div>
                    <motion.div
                        animate={pulseAnimation}
                        className="absolute inset-3 rounded-full border border-ui-border opacity-50"
                        transition={pulseTransition}
                    />
                    <motion.div
                        animate={dotPulseAnimation}
                        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-sm"
                        transition={dotPulseTransition}
                    />
                </div>

                <h2 className={`mt-5 font-semibold text-text ${titleClass}`}>{title}</h2>
                <p className={`mt-2 text-text-subtle ${subtitleClass}`}>{subtitle}</p>

                <div className={`mt-4 w-full ${barWidth}`}>
                    <div className="relative h-1.5 overflow-hidden rounded-full bg-ui-border">
                        <div className="absolute inset-0 bg-primary/15" />
                        <motion.div
                            animate={barAnimation}
                            className="absolute inset-0 z-10"
                            style={{
                                color: "var(--primary)",
                                backgroundImage: "linear-gradient(90deg, transparent 0%, currentColor 50%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                backgroundRepeat: "repeat",
                            }}
                            transition={barTransition}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Renders the loading screen component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.title - The title value.
 * @param {any} props.subtitle - The subtitle value.
 * @returns {JSX.Element} The rendered loading screen component.
 */
function LoadingScreen({ title, subtitle }) {
    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <LoadingBubble
                className="w-[520px] max-w-[92%] z-10"
                subtitle={subtitle}
                title={title}
            />
        </div>
    );
}

export default LoadingScreen;
