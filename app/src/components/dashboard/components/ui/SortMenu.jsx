import React from "react";
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";

function renderOption(option) {
    return (
        <div className="flex items-center text-text-subtle">
            {option.svg ? (
                <svg
                    className="size-5 my-auto mx-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d={option.svg}/>
                </svg>
            ) : null}
            <div className="my-auto">{option.option}</div>
        </div>
    );
}

export default function SortMenu({
    value,
    onChange,
    options,
    buttonClassName,
    optionsClassName,
    title = "Sort",
}) {
    const buttonClass =
        buttonClassName ||
        "flex items-center justify-center w-[180px] h-[42px] pr-3 border-2 border-ui-border rounded-[5px] bg-ui-bg hover:bg-ui-bg-selected transition-colors text-text";
    const menuClass =
        optionsClassName ||
        "absolute z-10 mt-1 w-[180px] bg-ui-bg border-2 border-ui-border rounded-[5px] shadow-lg overflow-hidden text-text-subtle";

    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative">
                <ListboxButton className={buttonClass}>
                    {renderOption(value)}
                </ListboxButton>

                <ListboxOptions className={menuClass}>
                    <h6 className="px-3 py-2 text-sm font-semibold text-text hover:cursor-default">
                        {title}
                    </h6>
                    <div className="divide-y divide-ui-border">
                        {options.map((option) => (
                            <ListboxOption key={option.id} value={option}>
                                {({active, selected}) => (
                                    <button
                                        className={`w-full text-left px-3 py-2 text-sm transition-colors rounded ${active ? "bg-ui-bg-selected" : ""} ${selected ? "font-medium" : "font-normal"}`}
                                    >
                                        {renderOption(option)}
                                    </button>
                                )}
                            </ListboxOption>
                        ))}
                    </div>
                </ListboxOptions>
            </div>
        </Listbox>
    );
}
