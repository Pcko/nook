import {ClassicPreset} from "rete";
import React from "react";

/**
 * NOT IMPLEMENTED
 */
export class SliderControl extends ClassicPreset.Control {
    constructor(public min = 0, public max = 100, public step = 1, public value = 50, public onChange = () => {
    }) {
        super();
    }
}

export default function SliderComponent(props: { data: SliderControl }) {
    const {min, max, step, value, onChange} = props.data;
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange()}
        />
    );
}
