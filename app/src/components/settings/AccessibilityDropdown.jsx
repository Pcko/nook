import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

function AccessibilityDropdown({ options, selected, onChange }) {
    const optionLabels = {
        "normal": "Normal",
        "high-contrast": "High Contrast",
    };

    return (
        <div className="w-1/2 ml-auto mr-0 relative">
            <Listbox value={selected} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button className="w-full py-1 rounded-[5px] text-text text-center bg-ui-default border-2 border-ui-border cursor-pointer">
                        {optionLabels[selected]}
                    </Listbox.Button>

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute mt-1 w-full bg-ui-bg border border-ui-border rounded-md shadow-lg z-10">
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option}
                                    value={option}
                                    className={({ active }) =>
                                        `cursor-pointer select-none p-2 text-text first:rounded-t-[5px] last:rounded-b-[5px] ${
                                            active ? "bg-ui-bg-selected" : ""
                                        }`
                                    }
                                >
                                    {optionLabels[option]}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}

export default AccessibilityDropdown;
