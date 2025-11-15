import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormTopBar from "./FormTopBar";
import GrapesPagePreview from "./GrapesPagePreview";
import { AIIcon } from "../resources/DashboardIcons";

function PagePromptingStep({
                               closeForm,
                               aiPrompt,
                               setAiPrompt,
                               loading,
                               handleAiPromptSubmit,
                               aiPages,
                               handleSelectAiPage,
                           }) {
    const hasPages = Array.isArray(aiPages) && aiPages.length > 0;

    const handleSubmit = () => {
        if (!loading && aiPrompt.trim()) {
            handleAiPromptSubmit();
        }
    };

    const SkeletonPreviewCard = () => (
        <div className="rounded-[6px] border border-ui-border bg-ui-bg overflow-hidden animate-pulse">
            <div className="h-[250px] w-full bg-website-bg" />
            <div className="p-3 flex items-center justify-between">
                <div className="h-3 w-24 bg-ui-border/70 rounded" />
                <div className="h-6 w-20 bg-ui-border/70 rounded-full" />
            </div>
        </div>
    );

    return (
        <motion.div
            className="page-creation-window max-w-3xl p-4 md:p-5 rounded-[8px] mx-auto bg-website-bg border border-ui-border shadow-sm"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            <FormTopBar onClick={closeForm} title="Create a new page with AI" />

            {/* Prompt input area */}
            <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between gap-4">
                    <p className="text-small font-medium text-text">
                        Describe the page you want to create
                    </p>
                    <span className="text-[11px] text-text-subtle tracking-wide uppercase">
                        Step 1 of 2
                    </span>
                </div>

                <div className="relative">
                    <textarea
                        className={`w-full border-2 border-ui-border rounded-[6px] pl-4 pr-14 py-3
                            bg-ui-bg text-text placeholder-text-subtle text-small
                            focus:outline-none focus:border-primary transition-all 
                            duration-200 resize-none min-h-[72px]
                            ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        placeholder="e.g. A clean portfolio landing page for a minimalist architect..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        disabled={loading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />

                    <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !aiPrompt.trim()}
                        className={`absolute inset-y-0 my-auto right-2 flex items-center justify-center
                            w-9 h-9 rounded-2xl transition-all duration-150
                            ${
                            loading || !aiPrompt.trim()
                                ? "opacity-60 cursor-not-allowed"
                                : "hover:bg-ui-bg hover:border-primary hover:shadow-sm"
                        }`}
                        aria-label="Generate page from prompt"
                    >
                        <motion.div
                            whileTap={
                                loading || !aiPrompt.trim()
                                    ? undefined
                                    : { scale: 0.95 }
                            }
                            className="flex items-center justify-center w-full h-full"
                        >
                            <AIIcon
                                size={32}
                                colorStart={aiPrompt.length === 0 ? "#CECECE" : undefined}
                                colorMid={aiPrompt.length === 0 ? "#CECECE" : undefined}
                                colorEnd={aiPrompt.length === 0 ? "#CECECE" : undefined}
                                strokeColor={aiPrompt.length === 0 ? "#CECECE" : undefined}
                            />
                        </motion.div>
                    </motion.button>
                </div>
            </div>

            {/* Previews / loading feedback */}
            <AnimatePresence>
                {(loading || hasPages) && (
                    <motion.div
                        key="ai-previews"
                        className="mt-8 border-t border-ui-border pt-5"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-small font-semibold text-text">
                                    Generated layouts
                                </h3>
                                <p className="text-tiny text-text-subtle">
                                    {loading && !hasPages
                                        ? "Generating layout suggestions…"
                                        : "Choose a starting point. You can edit everything in the builder."}
                                </p>
                            </div>
                            <span className="text-tiny text-text-subtle">
                                {hasPages ? (
                                    <>
                                        {aiPages.length} suggestion
                                        {aiPages.length !== 1 ? "s" : ""}
                                    </>
                                ) : loading ? (
                                    "Working…"
                                ) : null}
                            </span>
                        </div>

                        {/* While loading and no pages yet: skeletons */}
                        {loading && !hasPages && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[0, 1].map((i) => (
                                    <SkeletonPreviewCard key={i} />
                                ))}
                            </div>
                        )}

                        {/* When pages are ready: real previews */}
                        {hasPages && (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                                layout
                            >
                                {aiPages.map((page, i) => (
                                    <motion.div
                                        key={i}
                                        layout
                                        whileHover={{
                                            y: -4,
                                            boxShadow:
                                                "0 10px 24px rgba(0,0,0,0.12)",
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 220,
                                            damping: 20,
                                        }}
                                        className="rounded-[6px] border border-ui-border bg-ui-bg overflow-hidden cursor-pointer"
                                        onClick={() => handleSelectAiPage(page)}
                                    >
                                        <GrapesPagePreview
                                            index={i}
                                            page={page}
                                            onSelect={() =>
                                                handleSelectAiPage(page)
                                            }
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default PagePromptingStep;