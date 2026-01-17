import {useCallback, useMemo, useState} from "react";

import type {PageMeta} from "../../services/interfaces/PageMeta";
import type {MetaWizardCloseReason} from "./MetaWizard";

function isMeaningfulMetaValue(v: unknown): boolean {
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (typeof v === "number") return Number.isFinite(v);
    if (typeof v === "boolean") return true;
    if (Array.isArray(v)) return v.length > 0;
    return true;
}

function countMeaningfulMetaFields(meta: PageMeta | null | undefined): number {
    if (!meta) return 0;
    return Object.entries(meta)
        .filter(([k, v]) => !["wizardSeen", "skipped"].includes(k) && isMeaningfulMetaValue(v))
        .length;
}

export function normalizeMetaOnClose(
    reason: MetaWizardCloseReason,
    current: PageMeta | null | undefined,
    incoming: PageMeta | null | undefined
): PageMeta {
    const inMeta = incoming || {};
    const meaningfulCount = countMeaningfulMetaFields(inMeta);

    return {
        ...(current || {}),
        ...inMeta,
        wizardSeen: true,
        skipped:
            reason === "skip" || inMeta.skipped === true
                ? true
                : meaningfulCount === 0,
    } as PageMeta;
}

/**
 * useMetaWizardState
 *
 * Small, standalone state hook for PageMeta + wizard close normalization.
 * This avoids any coupling to the WebsiteBuilder context.
 */
export function useMetaWizardState(initialValue: PageMeta = {} as PageMeta) {
    const [meta, setMeta] = useState<PageMeta>(initialValue || ({} as PageMeta));

    const metaConfigured = useMemo(() => countMeaningfulMetaFields(meta) > 0, [meta]);

    const applyClose = useCallback(
        (reason: MetaWizardCloseReason, incoming: PageMeta): PageMeta => {
            const next = normalizeMetaOnClose(reason, meta, incoming);
            setMeta(next);
            return next;
        },
        [meta]
    );

    const reset = useCallback((value: PageMeta = {} as PageMeta) => setMeta(value), []);

    return {
        meta,
        setMeta,
        metaConfigured,
        applyClose,
        reset,
    };
}
