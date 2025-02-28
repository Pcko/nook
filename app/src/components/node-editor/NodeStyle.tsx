import * as React from 'react';
import { ClassicScheme, RenderEmit } from '../types';
import { RefControl } from './refs/RefControl';
import { RefSocket } from './refs/RefSocket';

type NodeExtraData = { width?: number; height?: number };

type Props<S extends ClassicScheme> = {
    data: S['Node'] & NodeExtraData;
    styles?: () => any;
    emit: RenderEmit<S>;
};

export type NodeComponent<Scheme extends ClassicScheme> = (props: Props<Scheme>) => TSX.Element;

function sortByIndex<T extends [string, undefined | { index?: number }][]>(entries: T) {
    entries.sort((a, b) => {
        const ai = a[1]?.index || 0;
        const bi = b[1]?.index || 0;
        return ai - bi;
    });
}

export function <Scheme extends ClassicScheme>(props: Props<Scheme>) {
    const inputs = Object.entries(props.data.inputs);
    const outputs = Object.entries(props.data.outputs);
    const controls = Object.entries(props.data.controls);
    const selected = props.data.selected || false;
    const { id, label, width, height } = props.data;

    sortByIndex(inputs);
    sortByIndex(outputs);
    sortByIndex(controls);

    return (
        <div
            className={`
        bg-ui-bg
        border-2
        ${selected ? 'border-ui-border-selected' : 'border-ui-border'}
        rounded-lg
        cursor-pointer
        box-border
        ${width ? `w-[${width}px]` : 'w-[200px]'}
        ${height ? `h-[${height}px]` : 'h-auto'}
        pb-1.5
        relative
        select-none
        leading-none
        font-sans
        transition-all
        duration-300
        ease-in-out
        hover:bg-ui-bg-selected
        hover:border-ui-border-selected
        ${props.styles ? props.styles() : ''}
      `}
            data-testid="node"
        >
            {/* Title */}
            <div
                className={`
          text-black
          font-sans
          text-lg
          p-2
          ${selected ? 'bg-gradient-to-br from-primary to-primary-hover' : 'bg-gradient-to-br from-ui-subtle to-ui-bg'}
          rounded-t-lg
          border-b-2
          ${selected ? 'border-primary' : 'border-ui-border'}
          uppercase
          text-sm
          tracking-wide
        `}
                data-testid="title"
            >
                {label}
            </div>

            {/* Outputs */}
            {outputs.map(([key, output]) => (
                output && (
                    <div className="output text-right" key={key} data-testid={`output-${key}`}>
                        <div className="output-title inline-block text-white font-sans text-sm mx-1" data-testid="output-title">
                            {output?.label}
                        </div>
                        <RefSocket
                            name="output-socket"
                            side="output"
                            socketKey={key}
                            nodeId={id}
                            emit={props.emit}
                            payload={output.socket}
                            data-testid="output-socket"
                        />
                    </div>
                )
            ))}

            {/* Controls */}
            {controls.map(([key, control]) =>
                control ? (
                    <RefControl
                        key={key}
                        name="control"
                        emit={props.emit}
                        payload={control}
                        data-testid={`control-${key}`}
                    />
                ) : null
            )}

            {/* Inputs */}
            {inputs.map(([key, input]) =>
                    input && (
                        <div className="input text-left" key={key} data-testid={`input-${key}`}>
                            <RefSocket
                                name="input-socket"
                                side="input"
                                socketKey={key}
                                nodeId={id}
                                emit={props.emit}
                                payload={input.socket}
                                data-testid="input-socket"
                            />
                            {input && (!input.control || !input.showControl) && (
                                <div className="input-title inline-block text-white font-sans text-sm mx-1" data-testid="input-title">
                                    {input?.label}
                                </div>
                            )}
                            {input?.control && input?.showControl && (
                                <RefControl
                                    key={key}
                                    name="input-control"
                                    emit={props.emit}
                                    payload={input.control}
                                    data-testid="input-control"
                                />
                            )}
                        </div>
                    )
            )}
        </div>
    );
}