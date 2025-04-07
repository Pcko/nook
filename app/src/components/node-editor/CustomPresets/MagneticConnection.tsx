import * as React from "react";
import styled from "styled-components";
import { ClassicScheme, Presets } from "rete-react-plugin";

const { useConnection } = Presets.classic;

const Svg = styled.svg`
  overflow: visible !important;
  position: absolute;
  pointer-events: none;
  width: 9999px;
  height: 9999px;
`;

const Path = styled.path<{ styles?: (props: any) => any }>`
  ${(props) => props.styles && props.styles(props)};
  filter: blur(2px);
`;

export function MagneticConnection(props: {
    data: ClassicScheme["Connection"] & { isLoop?: boolean };
    styles?: () => any;
}) {
    const { path } = useConnection();

    if (!path) return null;

    return (
        <Svg data-testid="connection">
            <Path styles={props.styles} className={"fill-none stroke-secondary stroke-[5px] pointer-events-auto "} d={path} />
        </Svg>
    );
}
