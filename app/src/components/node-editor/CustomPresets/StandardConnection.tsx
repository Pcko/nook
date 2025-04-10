import * as React from "react";
import { ClassicScheme, Presets } from "rete-react-plugin";

const { useConnection } = Presets.classic;

export function StandardConnection(props: {
    data: ClassicScheme["Connection"] & { isLoop?: boolean };
    styles?: () => string; // Return a Tailwind class string
}) {
    const { path } = useConnection();

    if (!path) return null;

    return (
        <svg
            data-testid="connection"
            className="absolute overflow-visible pointer-events-none w-[9999px] h-[9999px]"
        >
            <path
                d={path}
                className={`fill-none stroke-secondary stroke-[5px] shadow-xl pointer-events-auto ${
                    props.styles ? props.styles() : ""
                }`}
            />
        </svg>
    );
}
