import React from "react"
import {motion} from "framer-motion"
import {CursorArrowRaysIcon, PencilSquareIcon, SparklesIcon,} from "@heroicons/react/24/outline"

const stepVariants = {
    initial: {opacity: 0, y: 6},
    animate: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {delay: 0.05 + i * 0.05, duration: 0.2, ease: "easeOut"},
    }),
}

function SelectElementPlaceholder() {
    return (
        <div className="flex flex-1 min-h-0 px-4 py-4">
            <div className="flex flex-col w-full md:items-center gap-4">
                {/* Tutorial */}
                <div className="w-full space-y-4">
                    <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-subtle">
                            AI Assistant
                        </p>
                        <h2 className="text-base font-semibold text-text">
                            Select an element in the canvas
                        </h2>
                        <p className="mt-1 text-sm text-text-subtle">
                            Click on a section, card, or any other element in your canvas.
                            Then the AI Assistant can improve the design, copy, and layout for you.
                        </p>
                    </div>

                    <div className="space-y-2">
                        {[
                            {
                                icon: CursorArrowRaysIcon,
                                title: "1. Click an element in the canvas",
                                desc: "Move your cursor over your layout and select a section or component you want to work on.",
                            },
                            {
                                icon: SparklesIcon,
                                title: "2. Choose an action or write a prompt",
                                desc: "Use quick actions like “Redesign” or describe what you want to change in your own words.",
                            },
                            {
                                icon: PencilSquareIcon,
                                title: "3. Review and refine the changes",
                                desc: "The AI updates the element for you. You can send more prompts to iterate on the result.",
                            },
                        ].map((step, i) => (
                            <motion.div
                                key={step.title}
                                custom={i}
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                className="flex items-start gap-3 rounded-lg border border-ui-border border-opacity-70 bg-website-bg bg-opacity-80 px-3 py-2.5"
                            >
                                <div
                                    className="mt-[2px] flex h-7 w-7 items-center justify-center rounded-full bg-primar bg-opacity-10">
                                    <step.icon className="h-4 w-4 text-primary"/>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-semibold text-text">{step.title}</p>
                                    <p className="text-xs text-text-subtle">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Illustration below on larger screens */}
                <div className="hidden md:flex w-full items-center justify-center pt-2">
                    <div className="relative w-full max-w-xs">
                        {/* Background blobs */}
                        <motion.div
                            className="absolute -top-6 -left-6 h-24 w-24 rounded-full"
                            animate={{x: [0, 10, -6, 0], y: [0, -6, 4, 0]}}
                            transition={{duration: 10, repeat: Infinity, ease: "easeInOut"}}
                        />
                        <motion.div
                            className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full"
                            animate={{x: [0, -8, 4, 0], y: [0, 4, -6, 0]}}
                            transition={{duration: 11, repeat: Infinity, ease: "easeInOut"}}
                        />

                        {/* Canvas mockup */}
                        <motion.div
                            initial={{opacity: 0, y: 8, scale: 0.97}}
                            animate={{opacity: 1, y: 0, scale: 1}}
                            transition={{duration: 0.25, ease: "easeOut"}}
                            className="relative z-10 rounded-xl border border-ui-border bg-website-bg bg-opacity-95 p-3 shadow-sm"
                        >
                            <div className="flex gap-2">
                                {/* Sidebar */}
                                <div className="flex w-8 flex-col gap-1.5">
                                    <div className="h-5 rounded bg-ui-border bg-opacity-40"/>
                                    <div className="h-5 rounded bg-ui-border bg-opacity-30"/>
                                    <div className="h-5 rounded bg-ui-border bg-opacity-20"/>
                                </div>

                                {/* Main canvas blocks */}
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-24 rounded bg-ui-border bg-opacity-40"/>
                                    <div className="h-3 w-32 rounded bg-ui-border bg-opacity-30"/>

                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {/* Selected component */}
                                        <motion.div
                                            className="relative h-14 rounded-lg border border-primary border-opacity-70 bg-primary bg-opacity-5"
                                            animate={{boxShadow: ["0 0 0 0 rgba(0,0,0,0)", "0 0 0 4px rgba(102,107,226,0.35)", "0 0 0 0 rgba(0,0,0,0)"]}}
                                            transition={{duration: 1.6, repeat: Infinity, ease: "easeInOut"}}
                                        >
                                            <div
                                                className="absolute inset-[3px] rounded-md border border-primary border-opacity-40"/>
                                        </motion.div>

                                        <div
                                            className="h-14 rounded-lg border border-ui-border border-opacity-40 bg-ui-bg bg-opacity-60"/>
                                        <div
                                            className="h-9 rounded-lg border border-ui-border border-opacity-50 bg-ui-bg bg-opacity-60"/>
                                        <div
                                            className="h-9 rounded-lg border border-ui-border border-opacity-50 bg-ui-bg bg-opacity-60"/>
                                    </div>
                                </div>
                            </div>

                            {/* Animated cursor hint near the selected component */}
                            <motion.div
                                className="absolute -bottom-2 left-10 flex items-center gap-1 rounded-full border border-ui-border bg-ui-bg px-2 py-1 shadow-md"
                                animate={{x: [0, 6, 0], y: [0, -2, 0]}}
                                transition={{duration: 1.6, repeat: Infinity, ease: "easeInOut"}}
                            >
                                <CursorArrowRaysIcon className="h-4 w-4 text-primary"/>
                                <span className="text-[10px] font-medium text-text-subtle">
                                  Select an element
                                </span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SelectElementPlaceholder;