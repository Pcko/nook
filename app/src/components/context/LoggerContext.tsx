import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import * as Sentry from "@sentry/react";
import { LoggerContextValue } from "../logging/types/loggerContextValue";
import { LogEntry } from "../logging/types/logEntry";
import { LogLevel } from "../logging/types/logLevel";

const MAX_LOGS = 1500;        // in-memory
const MAX_PERSISTED = 200;    // localStorage
const STORAGE_KEY = "app_logs";
const FLUSH_DELAY_MS = 2000;
const LOG_LEVEL_WEIGHT: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    fatal: 50,
};
const VALID_LOG_LEVELS: LogLevel[] = Object.keys(LOG_LEVEL_WEIGHT);

const parseSentryMinLevel = (): LogLevel => {
    const raw = (import.meta as any).env?.VITE_SENTRY_MIN_LEVEL;
    return VALID_LOG_LEVELS.includes(raw) ? raw : "warn";
};
const SENTRY_MIN_LEVEL = parseSentryMinLevel();

const shouldForwardToSentry = (level: LogLevel): boolean => {
    console.log(VALID_LOG_LEVELS)
    return LOG_LEVEL_WEIGHT[level] >= LOG_LEVEL_WEIGHT[SENTRY_MIN_LEVEL];
};

const toSentryLevel = (
    level: LogLevel
): "debug" | "info" | "warning" | "error" | "fatal" => {
    switch (level) {
        case "warn":
            return "warning";
        case "error":
            return "error";
        case "fatal":
            return "fatal";
        case "debug":
            return "debug";
        default:
            return "info";
    }
};

const forwardEntryToSentry = (entry: LogEntry, originalMeta: unknown): void => {
    const sentryLevel = toSentryLevel(entry.level);

    Sentry.addBreadcrumb({
        category: "app.log",
        message: entry.message,
        level: sentryLevel,
        data: {
            id: entry.id,
            level: entry.level,
            route: entry.route ?? undefined,
            sessionId: entry.sessionId,
            timestamp: entry.timestamp,
            userId: entry.userId ?? undefined,
        },
    });

    if (!shouldForwardToSentry(entry.level)) return;

    Sentry.withScope((scope) => {
        scope.setLevel(sentryLevel);
        scope.setTag("log_source", "frontend_logger");
        scope.setTag("log_level", entry.level);
        scope.setTag("session_id", entry.sessionId);
        if (entry.route) scope.setTag("route", entry.route);
        if (entry.userId) scope.setUser({ id: entry.userId });

        scope.setContext("app_log", {
            id: entry.id,
            level: entry.level,
            route: entry.route,
            sessionId: entry.sessionId,
            timestamp: entry.timestamp,
            meta: entry.meta,
        });

        if (originalMeta instanceof Error) {
            Sentry.captureException(originalMeta);
            return;
        }

        if (entry.level === "error" || entry.level === "fatal") {
            Sentry.captureException(new Error(entry.message));
            return;
        }

        Sentry.captureMessage(entry.message);
    });
};

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

const isQuotaExceeded = (e: any) =>
    e?.name === "QuotaExceededError" ||
    e?.code === 22 ||
    String(e?.message || "").toLowerCase().includes("quota");

const safeStringify = (value: unknown) => {
    const seen = new WeakSet<object>();
    return JSON.stringify(value, (_k, v) => {
        if (typeof v === "object" && v !== null) {
            if (seen.has(v)) return "[Circular]";
            seen.add(v);
        }
        if (typeof v === "bigint") return String(v);
        if (typeof v === "function") return "[Function]";
        return v;
    });
};

const sanitizeMeta = (meta: unknown) => {
    if (meta instanceof Error) {
        return {
            name: meta.name,
            message: meta.message,
            stack: typeof meta.stack === "string" ? meta.stack.slice(0, 2000) : undefined,
        };
    }
    if (meta == null || typeof meta === "number" || typeof meta === "boolean") return meta;
    if (typeof meta === "string") return meta.length > 2000 ? meta.slice(0, 2000) + "…(truncated)" : meta;

    try {
        const s = safeStringify(meta) ?? "";
        if (s.length <= 4000) return JSON.parse(s);
        return { _truncated: true, json: s.slice(0, 4000) };
    } catch {
        return { metaType: typeof meta };
    }
};

const readPersisted = (): LogEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as LogEntry[]).slice(-MAX_PERSISTED) : [];
    } catch {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        return [];
    }
};

const writePersisted = (logs: LogEntry[]) => {
    localStorage.setItem(STORAGE_KEY, safeStringify(logs));
};

export const LoggerProvider: React.FC<LoggerProviderProps> = ({ children, getUserId, getRoute }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [persistedLogs, setPersistedLogs] = useState<LogEntry[]>([]);

    const sessionIdRef = useRef(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
    const pendingRef = useRef<LogEntry[]>([]);
    const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setPersistedLogs(readPersisted());
    }, []);

    const flush = useCallback(() => {
        const batch = pendingRef.current;
        if (!batch.length) return;
        pendingRef.current = [];

        try {
            const merged = [...readPersisted(), ...batch].slice(-MAX_PERSISTED);
            writePersisted(merged);
            setPersistedLogs(merged);
        } catch (e) {
            if (isQuotaExceeded(e)) {
                try {
                    const merged = [...readPersisted(), ...batch]
                        .map((l) => (l.level === "error" || l.level === "fatal" ? l : { ...l, meta: undefined }))
                        .slice(-100);
                    writePersisted(merged);
                    setPersistedLogs(merged);
                    return;
                } catch {
                    try { localStorage.removeItem(STORAGE_KEY); } catch {}
                    setPersistedLogs([]);
                }
            }
            // batch nicht verlieren
            pendingRef.current = [...batch, ...pendingRef.current];
            console.error("Log persistence failed:", e);
        }
    }, []);

    const scheduleFlush = useCallback(() => {
        if (flushTimerRef.current) return;
        flushTimerRef.current = setTimeout(() => {
            flushTimerRef.current = null;
            flush();
        }, FLUSH_DELAY_MS);
    }, [flush]);

    useEffect(() => {
        return () => {
            if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
        };
    }, []);

    const log = useCallback(
        (level: LogLevel, message: string, meta: unknown = {}): string => {
            const timestamp = new Date().toISOString();

            const entry: LogEntry = {
                id: `${timestamp}-${Math.random()}`,
                level,
                message,
                meta: sanitizeMeta(meta),
                timestamp,
                sessionId: sessionIdRef.current,
                userId: getUserId?.() ?? null,
                route: getRoute?.() ?? null,
            };

            setLogs((prev) => [...prev, entry].slice(-MAX_LOGS));

            if ((import.meta as any).env?.VITE_ENV === "dev") {
                const consoleFn = (console as any)[level] || console.log.bind(console);
                consoleFn(`[${level}] ${message}`, entry.meta);
            }
            try {
                forwardEntryToSentry(entry, meta);
            } catch (sentryErr) {
                if ((import.meta as any).env?.DEV) {
                    console.error("Sentry forward failed:", sentryErr);
                }
            }

            pendingRef.current.push(entry);

            if (level === "error" || level === "fatal") {
                if (flushTimerRef.current) {
                    clearTimeout(flushTimerRef.current);
                    flushTimerRef.current = null;
                }
                flush();
            } else {
                scheduleFlush();
            }

            return entry.id;
        },
        [getUserId, getRoute, flush, scheduleFlush]
    );

    const clearLogs = useCallback(() => {
        setLogs([]);
        setPersistedLogs([]);
        pendingRef.current = [];
        if (flushTimerRef.current) {
            clearTimeout(flushTimerRef.current);
            flushTimerRef.current = null;
        }
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }, []);

    const reloadPersisted = useCallback(() => {
        setPersistedLogs(readPersisted());
    }, []);

    const combinedLogs = useMemo(() => {
        const map = new Map<string, LogEntry>();
        for (const l of [...persistedLogs, ...logs]) if (l?.id) map.set(l.id, l);
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
        reloadPersisted,
    };

    return <LoggerContext.Provider value={value}>{children}</LoggerContext.Provider>;
};
