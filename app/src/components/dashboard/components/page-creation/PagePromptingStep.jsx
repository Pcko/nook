import {motion, AnimatePresence} from "framer-motion";
import React from "react";

import LoadingCircleSpinner from "../../../general/LoadingCircleSpinner";
import { LoadingBubble } from "../../../general/LoadingScreen";
import PromptingTextArea from "../../../general/PromptingTextArea";

import FormTopBar from "./FormTopBar";
import GrapesPagePreview from "./GrapesPagePreview";


/**
 * Renders the page prompting step component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.closeForm - The close form value.
 * @param {any} props.aiPrompt - The ai prompt value.
 * @param {any} props.setAiPrompt - The set ai prompt value.
 * @param {any} props.loading - The loading value.
 * @param {any} props.handleAiPromptSubmit - The handle ai prompt submit value.
 * @param {any} props.aiPages - The ai pages value.
 * @param {any} props.handleSelectAiPage - The handle select ai page value.
 * @returns {JSX.Element} The rendered page prompting step component.
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

    /**
 * Handles submit.
 */
    const handleSubmit = () => {
        if (!loading && aiPrompt.trim()) {
            handleAiPromptSubmit();
        }
    };

    /**
 * Renders the skeleton preview card component.
 * @returns {JSX.Element} The rendered skeleton preview card component.
 */
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
                        handleSubmit={handleSubmit}
                        loading={loading}
                        placeholder={"e.g. A clean portfolio landing page for a minimalist architect..."}
                        prompt={aiPrompt}
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
                              <LoadingBubble
                                            className="w-full rounded-[8px] bg-website-bg"
                                            compact
                                            subtitle="Generating your pages..."
                                            title="Loading pages"
                                        />
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
                                            onSelect={() => handleSelectAiPage(page)}
                                            page={page}
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
