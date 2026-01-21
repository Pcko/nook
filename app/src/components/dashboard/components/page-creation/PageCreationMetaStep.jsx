import React from "react";
import {motion} from "framer-motion";

import FormTopBar from "./FormTopBar";
import MetaWizard from "../../../meta-wizard/MetaWizard";

/**
 * PageCreationMetaStep
 *
 * Optional, skippable step that collects metadata before page creation.
 * This step does not persist anything by itself; the parent decides when to
 * send metadata to the API (e.g. on POST /api/pages).
 */
function PageCreationMetaStep({
    closeForm,
    onBack,
    onWizardClose,
    initialValue,
    stepLabel = "Step 1 of 3",
}) {
    return (
        <motion.div
            animate={{opacity: 1, y: 0, scale: 1}}
            className="page-creation-window"
            exit={{opacity: 0, y: 8, scale: 0.98}}
            initial={{opacity: 0, y: 8, scale: 0.98}}
            transition={{duration: 0.2, ease: "easeOut"}}
        >
            <FormTopBar onClick={closeForm} title="Optional page setup"/>

            <div className="mt-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-small px-3 py-1.5 rounded-[6px] border border-ui-border bg-ui-bg text-text hover:border-primary hover:text-primary transition-colors"
                >
                    Back
                </button>
                <span className="text-[11px] text-text-subtle tracking-wide uppercase">{stepLabel}</span>
            </div>

            <div className="mt-3">
                <MetaWizard initialValue={initialValue || {}} onClose={onWizardClose}/>
            </div>
        </motion.div>
    );
}

export default PageCreationMetaStep;
