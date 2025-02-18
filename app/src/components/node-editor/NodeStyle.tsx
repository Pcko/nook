import { Presets } from "rete-react-plugin";
import { css } from "styled-components";

const styles = css<{ selected?: boolean }>`
    /* Node Container (Dark Mode) */
    background: linear-gradient(145deg, #2f3136, #23272a); /* Dark gray background */
    border: 2px solid ${(props) => (props.selected ? "#6B439B" : "#36393f")}; /* Primary color when selected, darker gray when not */
    border-radius: 12px;
    box-shadow: ${(props) =>
            props.selected
                    ? "0 8px 16px rgba(107, 67, 155, 0.3), 0 4px 8px rgba(107, 67, 155, 0.2)"  /* primary color */
                    : "0 6px 12px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.15)"};
    transition: all 0.3s ease-in-out;
    padding: 8px;

    /* Title Section */
    .title {
        color: ${(props) => (props.selected ? "#ffffff" : "#b9bbbe")}; /* Light text color when selected */
        font-weight: bold;
        text-align: center;
        padding: 10px;
        background: ${(props) =>
                props.selected
                        ? "linear-gradient(145deg, #6B439B, #5A3382)"  /* primary color gradient for selected */
                        : "linear-gradient(145deg, #3a3c42, #2e3136)"}; /* Darker gradient for non-selected */
        border-radius: 8px;
        border-bottom: 2px solid ${(props) => (props.selected ? "#6B439B" : "#444b53")}; /* Darker border when not selected */
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    /* Text Content */
    .text {
        color: ${(props) => (props.selected ? "#b9bbbe" : "#6a6f77")}; /* Lighter gray for selected text, darker for normal */
        font-size: 14px;
        padding: 10px;
        line-height: 1.5;
    }

    /* Hover Effects */
    &:hover {
        background: linear-gradient(145deg, #35383c, #2c2f34); /* Slightly lighter dark background on hover */
        border-color: ${(props) => (props.selected ? "#5A3382" : "#444b53")}; /* Hover effect with primary color or darker border */
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15); /* Darker shadow */
    }

    /* Output Socket (Green for active state) */
    .output-socket {
        margin-right: -6px;
        background: #34c759; /* Green for active output socket */
        width: 14px;
        height: 14px;
        border-radius: 50%;
        transition: transform 0.2s ease, background 0.3s ease;
    }

    /* Input Socket (Red for active state) */
    .input-socket {
        margin-left: -6px;
        background: #ff3b30; /* Red for active input socket */
        width: 14px;
        height: 14px;
        border-radius: 50%;
        transition: transform 0.2s ease, background 0.3s ease;
    }

    /* Socket Hover Effects */
    .output-socket:hover,
    .input-socket:hover {
        transform: scale(1.3);
        background: ${(props) => (props.selected ? "#6B439B" : "#3385ff")}; /* Primary color or blue when hovered */
    }

    /* Connecting Lines */
    .output-socket.active,
    .input-socket.active {
        background: #ffcc00; /* Yellow when socket is actively connected */
        transform: scale(1.4);
    }
`;

export function NodeStyle(props: any) {
    return <Presets.classic.Node styles={() => styles} {...props} />;
}
