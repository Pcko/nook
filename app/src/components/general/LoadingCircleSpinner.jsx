"use client"

import { motion } from "framer-motion"

/**
 * Renders the loading circle spinner component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.className - The class name value.
 * @returns {JSX.Element} The rendered loading circle spinner component.
 */
function LoadingCircleSpinner({ className = "" }) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                animate={{ rotate: 360 }}
                className="w-[40px] h-[40px] rounded-full border-4 border-ui-border border-t-primary will-change-transform"
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    )
}

export default LoadingCircleSpinner
