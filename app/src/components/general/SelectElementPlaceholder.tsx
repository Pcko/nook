import { motion } from "framer-motion"
import { CursorArrowRaysIcon } from "@heroicons/react/24/outline"
import React from "react"

export default function SelectElementPlaceholder() {
    return (
        <div className="flex flex-1 items-center justify-center bg-ui-bg/60 relative overflow-hidden">
            {/* Floating blobs */}
            <motion.div
                className="absolute w-40 h-40 rounded-full bg-primary/10 blur-3xl -top-10 -left-10"
                animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute w-32 h-32 rounded-full bg-secondary/10 blur-3xl -bottom-10 -right-10"
                animate={{ x: [0, -15, 10, 0], y: [0, 10, -15, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative z-10 max-w-sm rounded-xl border border-ui-border bg-website-bg/90 px-5 py-4 shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10"
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <CursorArrowRaysIcon className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-subtle">
                            AI Assistant
                        </p>
                        <p className="text-sm font-semibold text-text">
                            Wähle ein Element im Builder aus
                        </p>
                    </div>
                </div>

                <p className="mt-3 text-xs text-text-subtle">
                    Klicke im Canvas auf eine Sektion, Karte oder ein anderes Element, damit der
                    AI Assistant es für dich umgestalten, Texte optimieren oder Layout-Verbesserungen vorschlagen kann.
                </p>
            </motion.div>
        </div>
    )
}