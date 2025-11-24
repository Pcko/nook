import React, {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import FormTopBar from "./FormTopBar";
import GrapesPagePreview from "./GrapesPagePreview";
import {AIIcon} from "../resources/DashboardIcons";
import LoadingCircleSpinner from "../../general/LoadingCircleSpinner";

/**
 * PagePromptingStep
 *
 * Step in the page creation flow that:
 * - collects an AI prompt from the user
 * - triggers AI generation
 * - shows loading skeletons while AI-generated layouts are being fetched
 * - shows GrapesJS-based previews once layouts are available
 *
 * This component is intentionally UI-focused and does not handle any
 * API calls directly; it delegates actions to the callbacks passed in via props.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.closeForm - Callback to close the page creation window.
 * @param {string} props.aiPrompt - Current text value of the AI prompt textarea.
 * @param {Function} props.setAiPrompt - Setter for updating the AI prompt string.
 * @param {boolean} props.loading - Whether AI generation is currently running.
 * @param {Function} props.handleAiPromptSubmit - Called when the user submits the prompt.
 * @param {Array<Object>} props.aiPages - Array of AI-generated page objects.
 * @param {Function} props.handleSelectAiPage - Called when a user clicks on a generated page preview.
 * @returns {JSX.Element}
 */
function PagePromptingStep({
                               closeForm,
                               aiPrompt,
                               setAiPrompt,
                               loading,
                               handleAiPromptSubmit,
                               aiPages,
                               handleSelectAiPage,
                           }) {
    /**
     * True when there is at least one AI-generated page to preview.
     * Used to decide whether to show skeletons vs. real previews.
     */
    const hasPages = Array.isArray(aiPages) && aiPages.length > 0;
    /**
     *  Step of the form
     *  STEP 1 - a prompt can be entered to generate a Page
     *  STEP 2 - a preview of the generated Page to choose is shown
     */
    const step = loading || hasPages ? 2 : 1;
    /**
     * Local wrapper for triggering AI generation.
     * Guards against empty prompts and concurrent loading.
     */
    const handleSubmit = () => {
        if (!loading && aiPrompt.trim()) {
            handleAiPromptSubmit();
        }
    };

    /**
     * Lightweight skeleton card shown while waiting for AI-generated layouts.
     * This mirrors the shape of the real preview cards without GrapesJS overhead.
     */
    const SkeletonPreviewCard = () => (
        <div className="relative overflow-hidden rounded-md border border-ui-border bg-ui-bg animate-pulse">
            {/* Page-Placeholder */}
            <div className="h-[250px] w-full bg-website-bg" />
            {/* Overlay-Spinner mittig */}
            <LoadingCircleSpinner className="pointer-events-none absolute inset-0" />
        </div>
    )

    return (
        <motion.div
            className="page-creation-window max-w-3xl p-4 md:p-5 rounded-[8px] mx-auto bg-website-bg border border-ui-border shadow-sm"
            initial={{opacity: 0, y: 8, scale: 0.98}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 8, scale: 0.98}}
            transition={{duration: 0.2, ease: "easeOut"}}
        >
            {/* Top bar with close button */}
            <FormTopBar onClick={closeForm} title="Create a new page with AI"/>

            {/* Prompt input area */}
            <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between gap-4">
                    <p className="text-small font-medium text-text">
                        Describe the page you want to create:
                    </p>
                    <span className="text-[11px] text-text-subtle tracking-wide uppercase">
                        Step {step} of 2
                    </span>
                </div>

                <div className="relative">
                   <textarea
                       className={`prompt-textarea w-full border-2 border-ui-border rounded-[6px] pl-4 pr-14 py-3
                        bg-ui-bg text-text placeholder-text-subtle text-small
                        focus:outline-none focus:border-primary transition-all 
                        duration-200 resize-none min-h-[72px]
                        ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                       placeholder="e.g. A clean portfolio landing page for a minimalist architect..."
                       value={aiPrompt}
                       onChange={(e) => setAiPrompt(e.target.value)}
                       disabled={loading}
                       onKeyDown={(e) => {
                           if (e.shiftKey && (e.metaKey || e.ctrlKey)) {
                               e.preventDefault();
                               handleSubmit();
                           }
                       }}
                   />

                    {/* Submit button (AI icon) */}
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
                                    : {scale: 0.95}
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
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 8}}
                        transition={{duration: 0.2}}
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
                                    <SkeletonPreviewCard key={i}/>
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
                                            boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
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
                                            onSelect={() => handleSelectAiPage(page)}
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