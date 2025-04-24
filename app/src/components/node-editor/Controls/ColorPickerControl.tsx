import {ClassicPreset} from "rete";
import React from "react";

export class ColorPickerControl extends ClassicPreset.Control {
    constructor(public value = "#ffffff", public onChange = () => {}) {
        super();
    }
}

export default function ColorPickerComponent(props: { data: ColorPickerControl }) {
    const { value, onChange } = props.data;
    return (
        <input
            type="color"
            value={value}
            onChange={(e) => onChange()}
        />
    );
}