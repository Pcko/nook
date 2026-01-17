import BackgroundText from '../general/NookBackground';
import { motion } from 'framer-motion';

export function LoadingBubble({
    className = "",
    title = "Loading your workspace",
    subtitle = "Hang tight while we pull everything together.",
    compact = false,
}) {
    const ringSize = compact ? "h-16 w-16" : "h-20 w-20";
    const padding = compact ? "p-5" : "p-8";
    const titleClass = compact ? "text-h5" : "text-h4";
    const subtitleClass = compact ? "text-tiny" : "text-small";
    const barWidth = compact ? "max-w-[200px]" : "max-w-[260px]";

    return (
        <div
            className={`relative overflow-hidden rounded-[16px] border border-ui-border bg-ui-bg shadow-sm ${padding} ${className}`}
            aria-busy="true"
            aria-live="polite"
            role="status"
        >
            <div className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-primary opacity-10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-ui-border opacity-30 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
                <div className={`relative ${ringSize}`}>
                    <div className="absolute inset-0 rounded-full border border-ui-border opacity-60" />
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-3 rounded-full border border-ui-border opacity-50"
                        animate={{ scale: [0.92, 1, 0.92], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-sm"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                <h2 className={`mt-5 font-semibold text-text ${titleClass}`}>{title}</h2>
                <p className={`mt-2 text-text-subtle ${subtitleClass}`}>{subtitle}</p>

                <div className={`mt-4 w-full ${barWidth}`}>
                    <div className="relative h-1.5 overflow-hidden rounded-full bg-ui-border">
                        <motion.div
                            className="absolute inset-y-0 -left-1/2 w-1/2 rounded-full bg-primary"
                            animate={{ x: ["0%", "200%"] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingScreen({ title, subtitle }) {
    return (
        <div className="flex items-center justify-center bg-website-bg h-full w-full">
            <BackgroundText/>
            <LoadingBubble
                className="w-[520px] max-w-[92%] z-10"
                title={title}
                subtitle={subtitle}
            />
        </div>
    );
}

export default LoadingScreen;
