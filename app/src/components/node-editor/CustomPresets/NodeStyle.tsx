import { Presets } from "rete-react-plugin";
import { css } from "styled-components";

const styles = css<{ selected?: boolean }>`
    background: var(--primary);
    border-color: var(--ui-border);
    border-width: 2px;
    color: black;

    .title {
        color: var(--text-on-primary);
    }

    &:hover {
        background: var(--primary-hover);
    }

    ${(props) =>
            props.selected &&
            css`
                border-color: var(--ui-border-selected);
            `}
`;

export function StyledNode(props: any) {
    return <Presets.classic.Node styles={() => styles} {...props} />;
}
