import {ClassicPreset} from "rete";
import React from "react";

export class TextInputControl extends ClassicPreset.Control {
    constructor(public value = "", public onChange = (val) => {}) {
        super();
    }
}

export function TextInputComponent(props: { data: TextInputControl }) {
    const { value, onChange } = props.data;
    return (
        <input
            type="text"
            value={value}
            placeholder="Enter text"
            onChange={(e) => onChange(e.target.value)}
        />
    );
}