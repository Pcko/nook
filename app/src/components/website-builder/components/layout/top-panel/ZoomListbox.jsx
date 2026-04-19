import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import React from "react";


/**
 * Renders the zoom listbox component.
 *
 * @param {Object} props - Component props.
 * @param {any} props.value - The value value.
 * @param {any} props.onChange - Callback fired for the on change action.
 * @param {any} props.options - The options value.
 * @returns {JSX.Element} The rendered zoom listbox component.
 */
function ZoomListbox({ value, onChange, options }) {
    return (
            <Listbox onChange={onChange} value={value}>
                <div className="relative">
                    <ListboxButton
                            className={[
                                "flex items-center rounded border border-ui-border transition",
                                "bg-ui-bg hover:bg-ui-button-hover text-text-subtle font-medium",
                                "py-1 px-2 gap-1.5 text-tiny",
                                "focus:outline-none",
                            ].join(" ")}
                    >
          <span className="flex items-center h-6 bg-ui-bg-selected text-text px-1.5 rounded font-mono text-micro tracking-tight leading-none">
            {value}%
          </span>
                        <span
                                aria-hidden
                                className="inline-block border-x-4 border-x-transparent border-t-4 border-t-text-subtle translate-y-[1px]"
                        />
                    </ListboxButton>

                    <ListboxOptions
                            className={[
                                "absolute right-0 z-10 mt-0.5",
                                "bg-ui-bg border border-ui-border rounded-[5px]",
                                "shadow-lg overflow-hidden",
                                "py-1",
                                "focus:outline-none",
                                "min-w-[3.7rem]",
                            ].join(" ")}
                    >
                        {options.map((opt) => (
                                <ListboxOption key={opt} value={opt}>
                                    {({ active, selected }) => (
                                            <div
                                                    className={[
                                                        "w-full text-left px-2 py-1 text-tiny transition-colors",
                                                        active ? "bg-ui-bg-selected text-text" : "bg-ui-bg text-text-subtle",
                                                        selected ? "font-semibold text-text" : "font-normal",
                                                    ].join(" ")}
                                            >
                                                {opt}%
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
