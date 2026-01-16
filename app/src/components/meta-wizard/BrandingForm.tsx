import Field from "./Field.tsx";
import {JSX} from "react";
import type {PageMeta} from "../../services/interfaces/PageMeta.ts";

/**
 * BrandingForm
 *
 * All optional. Keeps the structure lightweight and aligned to Nook UI.
 *
 * @param {{value: PageMeta, onChange: (next: PageMeta) => void}} props
 * @returns {JSX.Element}
 */
function BrandingForm(props: { value: PageMeta; onChange: (next: PageMeta) => void }): JSX.Element {
    const { value, onChange } = props;
    const v = value || {};

    const setField = <K extends keyof PageMeta>(k: K, val: PageMeta[K]) => {
        onChange({...v, [k]: val});
    };

    const keywordsValue = Array.isArray(v.keywords) ? v.keywords.join(", ") : "";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Brand name" hint="Business name shown on the page">
                <input
                    className="w-full rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text"
                    value={v.brandName || ""}
                    onChange={(e) => setField("brandName", e.target.value)}
                    placeholder="e.g. Alpine Coffee"
                />
            </Field>

            <Field label="Tagline" hint="One short sentence">
                <input
                    className="w-full rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text"
                    value={v.tagline || ""}
                    onChange={(e) => setField("tagline", e.target.value)}
                    placeholder="e.g. Fresh coffee in Vienna."
                />
            </Field>

            <Field label="Tone" hint="How the text should sound">
                <select
                    className="w-full rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text"
                    value={v.tone || ""}
                    onChange={(e) => setField("tone", e.target.value)}
                >
                    <option value="">(optional)</option>
                    <option value="friendly">Friendly & casual</option>
                    <option value="neutral">Neutral / simple</option>
                    <option value="professional">Professional</option>
                    <option value="premium">Premium / elegant</option>
                </select>
            </Field>

            <Field label="Keywords" hint="Comma separated">
                <input
                    className="w-full rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text"
                    value={keywordsValue}
                    onChange={(e) => {
                        const next = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean);
                        setField("keywords", next.length ? next : undefined);
                    }}
                    placeholder="e.g. coffee, breakfast, local"
                />
            </Field>

            <Field label="Email" hint="Optional contact">
                <input
                    className="w-full rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text"
                    value={v.email || ""}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="hello@yourbusiness.com"
                />
            </Field>

            <Field label="Phone" hint="Optional contact">
                <input
                    className="w-full rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text"
                    value={v.phone || ""}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="+43 1 234 567"
                />
            </Field>

            <div className="md:col-span-2">
                <Field label="Services" hint="One per line (optional)">
          <textarea
              className="w-full min-h-[100px] rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text"
              value={v.services || ""}
              onChange={(e) => setField("services", e.target.value)}
              placeholder={"e.g.\nConsulting\nWorkshops\nSupport"}
          />
                </Field>
            </div>
        </div>
    );
}

export default BrandingForm;
