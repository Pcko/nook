import React, {JSX} from "react";

/**
 * Field
 *
 * Small, consistent form field wrapper for Nook UI.
 *
 * @param {{label: string, hint?: string, children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
function Field(props: { label: string; hint?: string; children: React.ReactNode }): JSX.Element {
    const { label, hint, children } = props;
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
                <div className="text-small font-semibold text-text">{label}</div>
                {hint ? <div className="text-micro text-text-subtle">{hint}</div> : null}
            </div>
            {children}
        </div>
    );
}

export default Field