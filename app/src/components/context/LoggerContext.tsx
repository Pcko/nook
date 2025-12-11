import React, {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {LoggerContextValue} from "../logging/types/loggerContextValue.ts";
import {LogEntry} from "../logging/types/logEntry.ts";
import {LogLevel} from "../logging/types/logLevel.ts";

const MAX_LOGS = 1500;
const STORAGE_KEY = "app_logs";

const LoggerContext = createContext<LoggerContextValue | null>(null);

export const useLogger = (): LoggerContextValue => {
    const ctx = useContext(LoggerContext);
    if (!ctx) {
        throw new Error("useLogger must be used within a LoggerProvider");
    }
    return ctx;
};

export interface LoggerProviderProps {
    children: ReactNode;
    getUserId?: () => string | null;
    getRoute?: () => string | null;
}

export const LoggerProvider: React.FC<LoggerProviderProps> = ({children, getUserId, getRoute}) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [persistedLogs, setPersistedLogs] = useState<LogEntry[]>([]);

    const sessionIdRef = useRef<string>(
        `${Date.now()}-${Math.random().toString(36).slice(2)}`
    );

    const createEntry = useCallback(
        (level: LogLevel, message: string, meta: unknown = {}): LogEntry => {
            const timestamp = new Date().toISOString();
            const userId = getUserId?.() ?? null;
            const route = getRoute?.() ?? null;

            return {
                id: `${timestamp}-${Math.random()}`,
                level,
                message,
                meta,
                timestamp,
                sessionId: sessionIdRef.current,
                userId,
                route
            };
        },
        [getUserId, getRoute]
    );

    const loadPersistedLogs = useCallback(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                setPersistedLogs([]);
                return;
            }
            const parsed = JSON.parse(raw) as unknown;
            if (Array.isArray(parsed)) {
                setPersistedLogs(parsed.slice(-MAX_LOGS));
            } else {
                setPersistedLogs([]);
            }
        } catch {
            setPersistedLogs([]);
        }
    }, []);

    const persistLogBatch = useCallback(async (batch: LogEntry[]) => {
        try {
            const existingRaw = localStorage.getItem(STORAGE_KEY);
            const existing = (existingRaw ? JSON.parse(existingRaw) : []) as LogEntry[];

            const merged = [...existing, ...batch];
            const trimmed = merged.slice(-MAX_LOGS);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
            setPersistedLogs(trimmed);
        } catch (err) {
            console.error("Log persistence failed:", err);
        }
    }, []);

    useEffect(() => {
        loadPersistedLogs();
    }, [loadPersistedLogs]);

    const log = useCallback(
        (level: LogLevel, message: string, meta: unknown = {}): string => {
            const entry = createEntry(level, message, meta);

            setLogs((prev) => {
                const next = [...prev, entry];
                return next.slice(-MAX_LOGS);
            });

            if ((import.meta as any).env?.VITE_ENV === "dev") {
                const consoleFn =
                    (console as any)[level] || console.log.bind(console);
                consoleFn(`[${level}] ${message}`, meta);
            }

            if (level === "error" || level === "fatal") {
                void persistLogBatch([entry]);
            }

            return entry.id;
        },
        [createEntry, persistLogBatch]
    );

    useEffect(() => {
        if (!logs.length) return;

        const interval = setInterval(() => {
            if (logs.length > 0) {
                const batch = [...logs];
                void persistLogBatch(batch);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [logs, persistLogBatch]);

    const clearLogs = useCallback(() => {
        setLogs([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const reloadPersisted = useCallback(() => {
        loadPersistedLogs();
    }, [loadPersistedLogs]);

    const combinedLogs = useMemo<LogEntry[]>(() => {
        const all = [...persistedLogs, ...logs];
        const map = new Map<string, LogEntry>();
        all.forEach((log) => {
            if (!log || !log.id) return;
            map.set(log.id, log);
        });
        return Array.from(map.values()).sort((a, b) => {
            const ta = new Date(a.timestamp || 0).getTime();
            const tb = new Date(b.timestamp || 0).getTime();
            return tb - ta;
        });
    }, [persistedLogs, logs]);

    const value: LoggerContextValue = {
        logs,
        persistedLogs,
        combinedLogs,
        log,
        clearLogs,
        reloadPersisted
    };

    return (
        <LoggerContext.Provider value={value}>
            {children}
        </LoggerContext.Provider>
    );
};