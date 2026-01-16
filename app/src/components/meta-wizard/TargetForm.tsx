import {JSX} from "react";
import Field from "./Field.tsx";
import type {PageMeta} from "../../services/interfaces/PageMeta.ts";

/**
 * TargetForm
 *
 * All optional. Defines the audience the page should address.
 *
 * @param {{value: PageMeta, onChange: (next: PageMeta) => void}} props
 * @returns {JSX.Element}
 */
function TargetForm(props: { value: PageMeta; onChange: (next: PageMeta) => void }): JSX.Element {
    const { value, onChange } = props;
    const v = value || {};

    const setField = (k: string, val: string) => onChange({ ...v, [k]: val });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Audience type" hint="Who should this page speak to?">
                <select
                    className="w-full rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text"
                    value={v.audienceType || ""}
                    onChange={(e) => setField("audienceType", e.target.value)}
                >
                    <option value="">(optional)</option>
                    <option value="local">Local customers</option>
                    <option value="b2b">Business customers (B2B)</option>
                    <option value="b2c">Private customers (B2C)</option>
                    <option value="online">Online / international</option>
                </select>
            </Field>

            <Field label="Region" hint="Optional (city/country)">
                <input
                    className="w-full rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text"
                    value={v.audienceRegion || ""}
                    onChange={(e) => setField("audienceRegion", e.target.value)}
                    placeholder="e.g. Vienna, Austria"
                />
            </Field>

            <div className="md:col-span-2">
                <Field label="Notes" hint="Anything special about your audience? (optional)">
          <textarea
              className="w-full min-h-[110px] rounded-[10px] border border-ui-border bg-ui-bg px-3 py-2 text-small text-text"
              value={v.audienceNotes || ""}
              onChange={(e) => setField("audienceNotes", e.target.value)}
              placeholder="e.g. busy professionals, price-sensitive, prefers fast booking…"
          />
                </Field>
            </div>
        </div>
    );
}

export default TargetForm