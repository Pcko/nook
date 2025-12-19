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
import { LoggerContextValue } from "../logging/types/loggerContextValue";
import { LogEntry } from "../logging/types/logEntry";
import { LogLevel } from "../logging/types/logLevel";

const MAX_LOGS = 1500;        // in-memory
const MAX_PERSISTED = 200;    // localStorage
const STORAGE_KEY = "app_logs";
const FLUSH_DELAY_MS = 2000;

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