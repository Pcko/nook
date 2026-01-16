import React, {JSX, useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {SparklesIcon, ArrowRightIcon, XMarkIcon} from "@heroicons/react/24/outline";

import BaseFormular from "./BaseFormular";
import BrandingForm from "./BrandingForm.tsx";
import TargetForm from "./TargetForm.tsx";
import type {PageMeta} from "../../services/interfaces/PageMeta.ts";

/** Wizard step identifiers used by {@link MetaWizard}. */
export type WizardStep = "welcome" | "base" | "branding" | "target";

/** Close reasons emitted by {@link MetaWizard}. */
export type MetaWizardCloseReason = "dismiss" | "skip" | "complete";

/**
 * Props for {@link MetaWizard}.
 */
export interface MetaWizardProps {
    /** Initial values used to prefill the wizard. */
    initialValue?: PageMeta;

    /** Called when the wizard finishes and stores the meta. */
    onComplete?: (meta: PageMeta) => void;

    /** Called when the user skips the wizard (meta is stored with `skipped: true`). */
    onSkip?: (meta: PageMeta) => void;

    /** Called when the wizard closes.
     * @param reason - Why the wizard was closed.
     * @param meta - The current meta values.
     */
    onClose?: (reason: MetaWizardCloseReason, meta: PageMeta) => void;
}

/**
 * MetaWizard
 *
 * Multi-step wizard to configure page meta data for consistent AI generation:
 * 1) Welcome screen (user may skip)
 * 2) Base form (basic needs)
 * 3) Branding form (tone/branding + personal/company data)
 * 4) Target form (target audience)
 *
 * All fields are optional.
 *
 * Persistence is intentionally handled by the parent via callbacks (onClose/onComplete/onSkip)
 * so this wizard can be used both before and after a page exists.
 *
 * @param {MetaWizardProps} props - Component props.
 * @returns {JSX.Element} Rendered wizard.
 */
function MetaWizard({onComplete, onSkip, onClose, initialValue}: MetaWizardProps): JSX.Element {
    const [step, setStep] = useState<WizardStep>("welcome");
    const [meta, setMeta] = useState<PageMeta>(initialValue || {});

    const steps = useMemo(
        () => [
            {key: "welcome", label: "Start"},
            {key: "base", label: "Basics"},
            {key: "branding", label: "Branding"},
            {key: "target", label: "Target"},
        ],
        []
    );

    const stepIndex = steps.findIndex((s) => s.key === step);
    const progress = stepIndex <= 0 ? 0 : Math.round((stepIndex / (steps.length - 1)) * 100);

    const goNext = (): void => {
        if (step === "welcome") setStep("base");
        else if (step === "base") setStep("branding");
        else if (step === "branding") setStep("target");
        else if (step === "target") handleFinish();
    };

    const goBack = (): void => {
        if (step === "target") setStep("branding");
        else if (step === "branding") setStep("base");
        else if (step === "base") setStep("welcome");
    };

    const handleSkipWizard = (): void => {
        const next: PageMeta = {
            ...meta,
            wizardSeen: true,
            skipped: true,
        };

        onSkip?.(next);
        onClose?.("skip", next);
    };

    const handleFinish = (): void => {
        const next: PageMeta = {
            ...meta,
            wizardSeen: true,
            skipped: false,
        };

        onComplete?.(next);
        onClose?.("complete", next);
    };

    return (
        <div className="w-full rounded-[14px] border-2 border-ui-border bg-ui-bg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ui-border px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <SparklesIcon className="h-4 w-4 text-primary"/>
                    </div>
                    <div className="min-w-0">
                        <div className="text-small font-semibold text-text truncate">Page Setup</div>
                        <div className="text-small text-text-subtle truncate">
                            Optional details for better content & consistent tone
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onClose?.("dismiss", meta)}
                        className="rounded-[10px] border border-ui-border bg-website-bg px-2 py-2 text-text hover:border-primary hover:text-primary transition-colors"
                        aria-label="Close wizard"
                    >
                        <XMarkIcon className="h-4 w-4"/>
                    </button>
                </div>
            </div>

            {/* Progress */}
            <div className="px-4 py-3 border-b border-ui-border bg-website-bg">
                <div className="flex items-center justify-between text-small text-text-subtle">
          <span>
            Step {Math.max(stepIndex + 1, 1)} / {steps.length}:{" "}
              <span className="text-text font-semibold">{steps[Math.max(stepIndex, 0)]?.label}</span>
          </span>
                    <span className="font-mono">{progress}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-ui-bg border border-ui-border overflow-hidden">
                    <div className="h-full bg-primary" style={{width: `${progress}%`}}/>
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                <AnimatePresence mode="wait">
                    {step === "welcome" && (
                        <motion.div
                            key="welcome"
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -8}}
                            transition={{duration: 0.18}}
                            className="space-y-3"
                        >
                            <div className="rounded-[12px] border border-ui-border bg-website-bg p-4">
                                <div className="text-base font-semibold text-text">Set up your page details</div>
                                <div className="mt-1 text-small text-text-subtle">
                                    You can optionally add branding, tone, and audience info. This helps generate more
                                    consistent pages.
                                </div>
                                <ul className="mt-3 text-small text-text-subtle list-disc pl-5 space-y-1">
                                    <li>All fields are optional</li>
                                    <li>You can change everything later</li>
                                    <li>Better input = better generated content</li>
                                </ul>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <button
                                    type="button"
                                    className="rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text hover:border-primary hover:text-primary transition-colors"
                                    onClick={handleSkipWizard}
                                >
                                    Skip setup
                                </button>

                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-small font-semibold text-white hover:opacity-95"
                                    onClick={goNext}
                                >
                                    Start
                                    <ArrowRightIcon className="h-4 w-4"/>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === "base" && (
                        <motion.div
                            key="base"
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -8}}
                            transition={{duration: 0.18}}
                            className="space-y-4"
                        >
                            <div className="text-small text-text-subtle">
                                Basics help the generator pick the right structure and wording.
                            </div>

                            <div className="rounded-[12px] border border-ui-border bg-website-bg p-4">
                                <BaseFormular
                                    value={meta}
                                    onChange={(patch) => setMeta((prev) => ({...prev, ...patch}))}
                                />
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <button
                                    type="button"
                                    className="rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text hover:border-primary hover:text-primary transition-colors"
                                    onClick={goBack}
                                >
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-small font-semibold text-white hover:opacity-95"
                                    onClick={goNext}
                                >
                                    Continue
                                    <ArrowRightIcon className="h-4 w-4"/>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === "branding" && (
                        <motion.div
                            key="branding"
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -8}}
                            transition={{duration: 0.18}}
                            className="space-y-4"
                        >
                            <div className="text-small text-text-subtle">
                                Branding info improves tone, consistency, and contact sections.
                            </div>

                            <div className="rounded-[12px] border border-ui-border bg-website-bg p-4">
                                <BrandingForm value={meta} onChange={setMeta}/>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <button
                                    type="button"
                                    className="rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text hover:border-primary hover:text-primary transition-colors"
                                    onClick={goBack}
                                >
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-small font-semibold text-white hover:opacity-95"
                                    onClick={goNext}
                                >
                                    Continue
                                    <ArrowRightIcon className="h-4 w-4"/>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === "target" && (
                        <motion.div
                            key="target"
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -8}}
                            transition={{duration: 0.18}}
                            className="space-y-4"
                        >
                            <div className="text-small text-text-subtle">
                                Audience selection helps choose wording and call-to-actions.
                            </div>

                            <div className="rounded-[12px] border border-ui-border bg-website-bg p-4">
                                <TargetForm value={meta} onChange={setMeta}/>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <button
                                    type="button"
                                    className="rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text hover:border-primary hover:text-primary transition-colors"
                                    onClick={goBack}
                                >
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-small font-semibold text-white hover:opacity-95"
                                    onClick={handleFinish}
                                >
                                    Finish
                                    <ArrowRightIcon className="h-4 w-4"/>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default MetaWizard;
