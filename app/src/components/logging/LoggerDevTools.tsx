import React, {useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useLogger} from "../context/LoggerContext";
import {LogLevel} from "./types/logLevel";
import {LogEntry} from "./types/logEntry";

const ALL_LEVELS: LogLevel[] = ["debug", "info", "warn", "error", "fatal"];

const levelBadgeClasses = (level?: LogLevel): string => {
    switch (level) {
        case "debug":
            return "border-log-debug-border bg-log-debug-bg text-log-debug-text";
        case "info":
            return "border-log-info-border bg-log-info-bg text-log-info-text";
        case "warn":
            return "border-log-warn-border bg-log-warn-bg text-log-warn-text";
        case "error":
            return "border-log-error-border bg-log-error-bg text-log-error-text";
        case "fatal":
            return "border-log-fatal-border bg-log-fatal-bg text-log-fatal-text";
        default:
            return "border-log-default-border bg-log-default-bg text-log-default-text";
    }
};

const formatTimestamp = (ts?: string): string => {
    if (!ts) return "";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return ts;
    return d.toLocaleString();
};

export function LogVisualizer(): React.JSX.Element {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevels, setSelectedLevels] = useState<Set<LogLevel>>(
        () => new Set(ALL_LEVELS)
    );
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

    const {logs: inMemoryLogs, persistedLogs, combinedLogs, clearLogs, reloadPersisted} = useLogger();

    const filteredLogs = useMemo<LogEntry[]>(() => {
        const term = searchTerm.trim().toLowerCase();

        return combinedLogs.filter((log) => {
            if (log.level && !selectedLevels.has(log.level)) return false;
            if (!term) return true;

            const parts: string[] = [
                log.message ?? "",
                log.level ?? "",
                log.route ?? "",
                log.userId ?? "",
                log.sessionId ?? "",
                log._storageKey ?? ""
            ];

            if (log.meta !== undefined) {
                try {
                    parts.push(JSON.stringify(log.meta));
                } catch {
                    // ignore
                }
            }

            return parts.join(" ").toLowerCase().includes(term);
        });
    }, [combinedLogs, selectedLevels, searchTerm]);

    const selectedLog = filteredLogs.find((l) => l.id === selectedLogId) ?? null;

    const toggleLevel = (level: LogLevel) => {
        setSelectedLevels((prev) => {
            const next = new Set(prev);
            if (next.has(level)) {
                next.delete(level);
            } else {
                next.add(level);
            }
            if (next.size === 0) {
                return new Set(ALL_LEVELS);
            }
            return next;
        });
    };

    return (
        <div
            className="
                flex w-full flex-col gap-4
                min-h-[520px]
                h-[calc(100vh-70px)]
                max-h-[calc(100vh-70px)]
                overflow-hidden
            "
        >
            {/* Kopfbereich */}
            <div
                className="border-2 border-ui-border rounded-[10px] bg-ui-bg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-text-subtle m-0">
                        System
                    </p>
                    <p className="text-sm font-semibold text-text m-0">
                        Logging &amp; Crash Analysis
                    </p>
                    <p className="text-[11px] text-text-subtle m-0">
                        {combinedLogs.length} Entries · filterable after Level, Text und Context
                    </p>
                    <p className="text-[11px] text-text-subtle m-0">
                        {inMemoryLogs.length} in Memory · {persistedLogs.length} persisted
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={reloadPersisted}
                        className="px-3 py-1.5 text-[11px] font-medium rounded-[6px]
                                   border border-ui-border bg-website-bg text-text
                                   hover:border-primary hover:text-primary transition-colors"
                    >
                        Reload Persisted
                    </button>
                    <button
                        type="button"
                        onClick={clearLogs}
                        className="px-3 py-1.5 text-[11px] font-medium rounded-[6px]
                                   border border-dangerous/60 text-dangerous
                                   bg-website-bg hover:bg-dangerous/5 transition-colors"
                    >
                        Memory Flush
                    </button>
                </div>
            </div>

            {/* Filterleiste */}
            <div
                className="border-2 border-ui-border rounded-[10px] bg-ui-bg px-4 py-2 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search in message, route, user, meta …"
                        className="w-full text-xs px-3 py-1.5 rounded-[6px] border border-ui-border
                                   bg-website-bg text-text placeholder:text-text-subtle
                                   focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {ALL_LEVELS.map((level) => {
                        const active = selectedLevels.has(level);
                        const classes = active
                            ? levelBadgeClasses(level)
                            : "border-ui-border bg-website-bg text-text-subtle";
                        return (
                            <button
                                key={level}
                                type="button"
                                onClick={() => toggleLevel(level)}
                                className={`text-[11px] px-2 py-1 rounded-[999px] border
                                            uppercase tracking-[0.14em] ${classes}`}
                            >
                                {level}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Hauptbereich: 2 Spalten */}
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Liste */}
                <div className="flex flex-col min-h-0 border-2 border-ui-border rounded-[10px] bg-website-bg">
                    <div className="px-4 py-2 border-b border-ui-border flex items-center justify-between">
                        <p className="text-xs font-semibold text-text m-0">
                            Log Entries
                        </p>
                        <p className="text-[11px] text-text-subtle m-0">
                            {filteredLogs.length} shown
                        </p>
                    </div>
                    <div className="flex-1 min-h-0 p-3 space-y-2 overflow-y-auto">
                        <AnimatePresence initial={false}>
                            {filteredLogs.map((log) => {
                                const isSelected = log.id === selectedLogId;
                                const badgeClasses = levelBadgeClasses(log.level);

                                return (
                                    <motion.button
                                        key={log.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedLogId((prev) =>
                                                prev === log.id ? null : log.id
                                            )
                                        }
                                        className={`w-full text-left flex flex-col gap-1 p-3 border-2 rounded-[6px]
                                                    bg-website-bg transition-colors focus:outline-none
                                                    ${
                                            isSelected
                                                ? "border-primary shadow-md"
                                                : "border-ui-border hover:border-primary hover:shadow-md"
                                        }`}
                                        whileHover={{y: -2}}
                                        whileTap={{scale: 0.97}}
                                        layout
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 text-[11px] border rounded-[999px] ${badgeClasses}`}
                                            >
                                                {log.level || "unknown"}
                                            </span>
                                            <span className="text-[11px] text-text-subtle">
                                                {formatTimestamp(log.timestamp)}
                                            </span>
                                        </div>

                                        <p className="text-xs font-semibold text-text line-clamp-2 m-0">
                                            {log.message}
                                        </p>

                                        <div className="flex items-center justify-between text-[11px] text-text-subtle">
                                            <span className="truncate max-w-[60%]">
                                                {log.meta.component || "/"} - {log.meta.url || log.meta.feature || '/'}
                                            </span>
                                            <span className="truncate max-w-[40%] text-right">
                                                {log.userId ? `user: ${log.userId}` : ""}
                                            </span>
                                        </div>
                                    </motion.button>
                                );
                            })}

                            {!filteredLogs.length && (
                                <motion.div
                                    layout
                                    className="p-4 border-2 border-dashed border-ui-border rounded-[6px] bg-website-bg text-center"
                                >
                                    <p className="text-xs text-text-subtle m-0">
                                        No logs for the applied filter.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col min-h-0 border-2 border-ui-border rounded-[10px] bg-website-bg">
                    <div className="px-4 py-2 border-b border-ui-border flex items-center justify-between">
                        <p className="text-xs font-semibold text-text m-0">
                            Details
                        </p>
                        {selectedLog && (
                            <p className="text-[11px] text-text-subtle m-0 truncate">
                                {selectedLog.id}
                            </p>
                        )}
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden rounded-b-[9px]">
                        {selectedLog ? (
                            <div className="h-full overflow-auto bg-website-bg text-text p-3">
                                <pre className="text-[11px] leading-snug whitespace-pre-wrap break-all">
                                    {JSON.stringify(selectedLog, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-ui-bg">
                                <p className="text-[11px] text-text-subtle m-0">
                                    Choose a entry on the left, to see details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};