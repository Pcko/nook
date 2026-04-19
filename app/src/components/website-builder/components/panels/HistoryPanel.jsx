import React, {useMemo} from "react";

import DateTimeService from "../../../../services/DateTimeService";
import {useBuilder} from "../../hooks/UseBuilder";


/**
 * HistoryPanel
 *
 * Minimal UI to inspect snapshot history and restore earlier states.
 */
function HistoryPanel() {
    const {history, historyIndex, goToHistory, aiBusy} = useBuilder();

    const items = useMemo(() => (Array.isArray(history) ? history : []), [history]);

    if (!items.length) {
        return (
            <div className="h-full rounded-[10px] border-2 border-ui-border bg-ui-bg p-3">
                <p className="m-0 text-small font-semibold text-text">History</p>
                <p className="mt-2 text-small text-text-subtle">No history yet.</p>
            </div>
        );
    }

    return (
        <div className={"h-full rounded-[10px] border-2 border-ui-border bg-ui-bg p-2 " + (aiBusy ? "pointer-events-none opacity-60" : "")}
        >
            <div className="px-2 pt-1 pb-2 border-b border-ui-border">
                <p className="m-0 text-small font-semibold text-text">History</p>
                <p className="m-0 text-small text-text-subtle">
                    Click an entry to restore that state.
                </p>
            </div>

            <div className="mt-2 flex flex-col gap-1 overflow-y-auto max-h-full px-1">
                {items
                    .map((it, idx) => ({it, idx}))
                    .reverse()
                    .map(({it, idx}) => {
                        const isActive = idx === historyIndex;

                        return (
                            <button
                                className={
                                    "w-full text-left rounded border border-ui-border px-2 py-1 transition " +
                                    (isActive
                                        ? "bg-ui-bg-selected text-text"
                                        : "bg-ui-bg text-text-subtle hover:bg-ui-button-hover")
                                }
                                key={it.id}
                                onClick={() => goToHistory(idx)}
                                title={DateTimeService.formatTime(it.ts)}
                                type="button"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className={"text-tiny font-semibold " + (isActive ? "text-text" : "text-text-subtle")}
                                    >
                                        {it.reason || "Edit"}
                                    </span>

                                    <span className="text-micro font-mono bg-ui-bg-selected text-text px-1.5 py-0.5 rounded">
                                        {DateTimeService.formatTime(it.ts)}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
            </div>
        </div>
    );
}

export default HistoryPanel;

