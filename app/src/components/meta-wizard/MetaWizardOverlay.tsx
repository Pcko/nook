import React, {JSX, useMemo} from "react";

import CenteredWindowWithBackgroundBlur from "../general/CenteredWindowWithBackgroundBlur.jsx";
import MetaWizard from "./MetaWizard.tsx";
import {useBuilder} from "../website-builder/hooks/UseBuilder";

import type {PageMeta} from "../../services/interfaces/PageMeta.ts";
import type {MetaWizardCloseReason} from "./MetaWizard.tsx";

/**
 * @file MetaWizardOverlay.tsx
 *
 * Renders {@link MetaWizard} inside a modal overlay.
 *
 * The overlay is controlled by builder context:
 * - {@link useBuilder}.isMetaWizardOpen controls visibility
 * - {@link useBuilder}.pageMeta provides initial values
 * - {@link useBuilder}.setPageMeta persists updates (localStorage)
 */

/**
 * MetaWizardOverlay
 *
 * @returns {JSX.Element|null} Overlay element or null when closed.
 */
function MetaWizardOverlay(): JSX.Element | null {
    const {pageMeta, setPageMeta, isMetaWizardOpen, closeMetaWizard} = useBuilder();

    const initialValue = useMemo<PageMeta>(() => pageMeta || {}, [pageMeta]);

    if (!isMetaWizardOpen) return null;

    /**
     * Handles wizard close events.
     *
     * When a user dismisses the wizard (X), we mark it as seen to avoid auto-opening again.
     *
     * @param {MetaWizardCloseReason} reason - Close reason.
     * @param {PageMeta} meta - Current meta values.
     */
    const handleClose = (reason: MetaWizardCloseReason, meta: PageMeta): void => {
        if (reason === "dismiss") {
            const meaningfulKeys = Object.keys(meta || {}).filter((k) => !["wizardSeen", "skipped"].includes(k));
            const next: PageMeta = {
                ...(pageMeta || {}),
                ...(meta || {}),
                wizardSeen: true,
                skipped: (pageMeta?.skipped ?? false) || meaningfulKeys.length === 0,
            };
            setPageMeta(next);
        }

        closeMetaWizard();
    };

    return (
        <CenteredWindowWithBackgroundBlur>
            <div className="w-[920px] max-w-[96vw]">
                <MetaWizard initialValue={initialValue} onClose={handleClose}/>
            </div>
        </CenteredWindowWithBackgroundBlur>
    );
}

export default MetaWizardOverlay;
