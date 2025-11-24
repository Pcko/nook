"use client"

import { motion } from "framer-motion"

function LoadingCircleSpinner({ className = "" }) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                className="w-[40px] h-[40px] rounded-full border-4 border-ui-border border-t-primary will-change-transform"
                animate={{ rotate: 360 }}
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
