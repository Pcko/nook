import * as React from "react";
import styled from "styled-components";
import {ClassicScheme, Presets} from "rete-react-plugin";
import {Connection} from "../connection";

const {useConnection} = Presets.classic;

const Svg = styled.svg`
    overflow: visible !important;
    position: absolute;
    pointer-events: none;
    width: 9999px;
    height: 9999px;
`;

const Path = styled.path<{ styles?: (props: any) => any }>`
    fill: none;
    stroke-width: 5px;
    stroke: var(--primary);
    pointer-events: auto;
    ${(props) => props.styles && props.styles(props)};
    filter: blur(2px);
`;

export function MagneticConnection(props: {
    data: Connection<any, any> & { isLoop?: boolean };
    styles?: () => any;
}) {
    const {path} = useConnection();

    if (!path) return null;

    return (
        <Svg data-testid="connection">
            <Path styles={props.styles} d={path}/>
        </Svg>
    );
}
