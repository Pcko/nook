import {ClassicPreset} from "rete";
import React from "react";

export class DropdownControl extends ClassicPreset.Control {
    constructor(public options: string[] = [], public value = "", public onChange = (val) => {}) {
        super();
    }
}

export function DropdownComponent(props: { data: DropdownControl }) {
    const { options, value, onChange } = props.data;
    return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
    {options.map((opt) => (
        <option key={opt} value={opt}>
        {opt}
        </option>
    ))}
    </select>
);
}