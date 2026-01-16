import React, {JSX, useMemo} from "react";
import Field from "./Field.tsx";
import type {PageMeta} from "../../services/interfaces/PageMeta.ts";


/**
 * Props for {@link BaseFormular}.
 */
export interface BaseFormularProps {
    /** Current meta values. */
    value: PageMeta;

    /** Emits a partial update to be merged by the parent. */
    onChange: (patch: Partial<PageMeta>) => void;

    /** Disables inputs. */
    disabled?: boolean;
}

/**
 * BaseFormular (Basics step)
 *
 * Refactored to fit MetaWizard:
 * - No confirm button (wizard controls navigation)
 * - All fields optional
 * - Emits partial updates (patch) to be merged by the parent
 * - Uses Nook UI tokens/classes (no CoreUI dependency)
 *
 * @param {BaseFormularProps} props - Component props.
 * @returns {JSX.Element} Basics step form.
 */
function BaseFormular(props: BaseFormularProps): JSX.Element {
    const {value, onChange, disabled = false} = props;

    const v = value || {};

    /**
     * Emits a partial update to the parent.
     *
     * @param {Partial<PageMeta>} patch - Fields to update.
     * @returns {void}
     */
    const patch = (patch: Partial<PageMeta>): void => {
        onChange?.(patch);
    };

    const languageOptions = useMemo(
        () => [
            {code: "", label: "Select language…"},
            {code: "en", label: "English"},
            {code: "de", label: "German"},
            {code: "es", label: "Spanish"},
            {code: "fr", label: "French"},
        ],
        []
    );

    const industryOptions = useMemo(
        () => [
            {value: "", label: "Select industry…"},
            {value: "restaurant", label: "Restaurant / Café"},
            {value: "trades", label: "Trades (Plumber, Electrician, …)"},
            {value: "services", label: "Services / Consulting"},
            {value: "health", label: "Health / Beauty"},
            {value: "retail", label: "Retail / Shop"},
            {value: "creative", label: "Creative (Photo, Design, …)"},
            {value: "it", label: "IT / Software"},
            {value: "other", label: "Other"},
        ],
        []
    );

    const goalOptions = useMemo(
        () => [
            {value: "", label: "Select website goal…"},
            {value: "leads", label: "Get inquiries (Leads)"},
            {value: "bookings", label: "Bookings / Appointments"},
            {value: "shop", label: "Online shop"},
            {value: "portfolio", label: "Portfolio"},
            {value: "info", label: "Info page"},
        ],
        []
    );

    const selectClass = [
        "w-full rounded-[10px] border border-ui-border bg-ui-bg",
        "px-3 py-2 text-small text-text",
        "focus:outline-none focus:ring-2 focus:ring-primary/30",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "transition",
    ].join(" ");

    const inputClass = [
        "w-full rounded-[10px] border border-ui-border bg-ui-bg",
        "px-3 py-2 text-small text-text",
        "focus:outline-none focus:ring-2 focus:ring-primary/30",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "transition",
    ].join(" ");

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Language" hint="improves wording consistency">
                    <select
                        className={selectClass}
                        value={v.language ?? ""}
                        onChange={(e) => patch({language: e.target.value})}
                        disabled={disabled}
                    >
                        {languageOptions.map((o) => (
                            <option key={o.code} value={o.code}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Website goal" hint="helps choose sections & CTA">
                    <select
                        className={selectClass}
                        value={v.websiteGoal ?? ""}
                        onChange={(e) => patch({websiteGoal: e.target.value as any})}
                        disabled={disabled}
                    >
                        {goalOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Industry / business type" hint="improves structure & tone">
                    <select
                        className={selectClass}
                        value={v.industry ?? ""}
                        onChange={(e) => {
                            const nextIndustry = e.target.value;
                            patch(nextIndustry === "other"
                                ? {industry: nextIndustry}
                                : {industry: nextIndustry, industryOther: ""}
                            );
                        }}
                        disabled={disabled}
                    >
                        {industryOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </Field>

                {v.industry === "other" && (
                    <Field label="Other (please specify)" hint="Optional">
                        <input
                            className={inputClass}
                            value={v.industryOther ?? ""}
                            onChange={(e) => patch({industryOther: e.target.value})}
                            placeholder="e.g. Education, Real estate, Events…"
                            disabled={disabled}
                        />
                    </Field>
                )}
            </div>
        </div>
    );
}

export default BaseFormular;
