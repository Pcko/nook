import {motion} from "framer-motion";
import React from "react";

import MetaWizard from "../../../meta-wizard/MetaWizard";

import FormTopBar from "./FormTopBar";

/**
 * Renders the page creation meta step component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.closeForm - The close form value.
 * @param {any} props.onBack - Callback fired for the on back action.
 * @param {any} props.onWizardClose - Callback fired for the on wizard close action.
 * @param {any} props.initialValue - The initial value value.
 * @param {any} props.stepLabel - The step label value.
 * @returns {JSX.Element} The rendered page creation meta step component.
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
                    className="text-small px-3 py-1.5 rounded-[6px] border border-ui-border bg-ui-bg text-text hover:border-primary hover:text-primary transition-colors"
                    onClick={onBack}
                    type="button"
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
