import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import LoadingCircleSpinner from "../../general/LoadingCircleSpinner";
import FormTopBar from "./FormTopBar";
import GrapesPagePreview from "./GrapesPagePreview";
import PromptingTextArea from "../../general/PromptingTextArea";

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
    const hasPages = Array.isArray(aiPages) && aiPages.length > 0;

    // Step 1 is the optional MetaWizard.
    // Step 2 is prompt input. Step 3 is preview selection.
    const step = loading || hasPages ? 3 : 2;

    const handleSubmit = () => {
        if (!loading && aiPrompt.trim()) {
            handleAiPromptSubmit();
        }
    };

    const SkeletonPreviewCard = () => (
        <div className="relative overflow-hidden rounded-md border border-ui-border bg-ui-bg animate-pulse">
            <div className="h-[250px] w-full bg-website-bg"/>
            <LoadingCircleSpinner className="pointer-events-none absolute inset-0"/>
        </div>
    );

    return (
        <motion.div
            animate={{opacity: 1, y: 0, scale: 1}}
            className="page-creation-window"
            exit={{opacity: 0, y: 8, scale: 0.98}}
            initial={{opacity: 0, y: 8, scale: 0.98}}
            transition={{duration: 0.2, ease: "easeOut"}}
        >
            <FormTopBar onClick={closeForm} title="Create a new page with AI"/>

            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-small font-medium text-text">Describe the page you want to create:</p>

                    <div className="flex items-center gap-3">
                        <span className="text-[11px] text-text-subtle tracking-wide uppercase">Step {step} of 3</span>
                    </div>
                </div>

                <div className="relative">
                    <PromptingTextArea
                        prompt={aiPrompt}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        placeholder={"e.g. A clean portfolio landing page for a minimalist architect..."}
                        setPrompt={setAiPrompt}
                    />
                </div>
            </div>

            <AnimatePresence>
                {(loading || hasPages) && (
                    <motion.div
                        animate={{opacity: 1, y: 0}}
                        className="mt-8 border-t border-ui-border pt-5"
                        exit={{opacity: 0, y: 8}}
                        initial={{opacity: 0, y: 8}}
                        key="ai-previews"
                        transition={{duration: 0.2}}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-small font-semibold text-text">Generated layouts</h3>
                                <p className="text-tiny text-text-subtle">
                                    {loading && !hasPages
                                        ? "Generating layout suggestions…"
                                        : "Choose a starting point. You can edit everything in the builder."}
                                </p>
                            </div>
                            <span className="text-tiny text-text-subtle">
                                {hasPages ? (
                                    <>
                                        {aiPages.length} suggestion{aiPages.length !== 1 ? "s" : ""}
                                    </>
                                ) : loading ? (
                                    "Working…"
                                ) : null}
                            </span>
                        </div>

                        {loading && !hasPages && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[0, 1].map((i) => (
                                    <SkeletonPreviewCard key={i}/>
                                ))}
                            </div>
                        )}

                        {hasPages && (
                            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5" layout>
                                {aiPages.map((page, i) => (
                                    <motion.div
                                        className="rounded-[6px] border border-ui-border bg-ui-bg overflow-hidden cursor-pointer"
                                        key={i}
                                        layout
                                        transition={{type: "spring", stiffness: 220, damping: 20}}
                                        whileHover={{y: -4, boxShadow: "0 10px 24px rgba(0,0,0,0.12)"}}
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
