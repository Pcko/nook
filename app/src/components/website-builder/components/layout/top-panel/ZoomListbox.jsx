import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";
import React from "react";

const BUTTON_CLASS = [
    "flex items-center gap-1.5 rounded border border-ui-border transition",
    "bg-ui-bg px-2 py-1 text-tiny font-medium text-text-subtle hover:bg-ui-button-hover",
    "focus:outline-none",
].join(" ");

const OPTIONS_CLASS = [
    "absolute right-0 z-10 mt-0.5 min-w-[3.7rem] overflow-hidden rounded-[5px] border border-ui-border bg-ui-bg py-1 shadow-lg",
    "focus:outline-none",
].join(" ");

const VALUE_CLASS = "flex h-6 items-center rounded bg-ui-bg-selected px-1.5 font-mono text-micro leading-none tracking-tight text-text";
const CARET_CLASS = "inline-block translate-y-[1px] border-x-4 border-x-transparent border-t-4 border-t-text-subtle";

/**
 * Renders the zoom listbox component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.value - The value value.
 * @param {any} props.onChange - Callback fired for the on change action.
 * @param {any} props.options - The options value.
 * @returns {JSX.Element} The rendered zoom listbox component.
 */
function ZoomListbox({value, onChange, options}) {
    return (
        <Listbox onChange={onChange} value={value}>
            <div className="relative">
                <ListboxButton className={BUTTON_CLASS}>
                    <span className={VALUE_CLASS}>{value}%</span>
                    <span aria-hidden className={CARET_CLASS}/>
                </ListboxButton>

                <ListboxOptions className={OPTIONS_CLASS}>
                    {options.map((option) => (
                        <ListboxOption key={option} value={option}>
                            {({active, selected}) => (
                                <div
                                    className={[
                                        "w-full px-2 py-1 text-left text-tiny transition-colors",
                                        active ? "bg-ui-bg-selected text-text" : "bg-ui-bg text-text-subtle",
                                        selected ? "font-semibold text-text" : "font-normal",
                                    ].join(" ")}
                                >
                                    {option}%
                                </div>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}

export default ZoomListbox;
