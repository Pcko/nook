import { useCallback, useEffect, useState } from "react";

const MAX_PER_KEY = 200;
const MAX_TOTAL = 500;
const MAX_RAW_CHARS = 300_000;

const safeParseArray = (raw) => {
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch {       return null;
    }
};

const getTs = (entry) => {
    const t = entry?.timestamp;
    const n = typeof t === "number" ? t : Date.parse(String(t ?? ""));
    return Number.isFinite(n) ? n : 0;
};

const usePersistedLogs = () => {
    const [logs, setLogs] = useState([]);

    const reload = useCallback(() => {
        const collected = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key || !key.endsWith("_logs")) continue;

            const raw = localStorage.getItem(key);
            if (!raw) continue;

            const parsed = safeParseArray(raw);
            if (!parsed) {
                try {
                    localStorage.removeItem(key); // corrupted -> delete
                } catch {}
                continue;
            }

            // Per-key cap (and write back trimmed to reduce storage)
            let trimmed = parsed;

            if (parsed.length > MAX_PER_KEY || raw.length > MAX_RAW_CHARS) {
                trimmed = parsed.slice(-MAX_PER_KEY);
                try {
                    localStorage.setItem(key, JSON.stringify(trimmed));
                } catch {
                    // If even trimming can't be saved (quota), delete the key
                    try {
                        localStorage.removeItem(key);
                    } catch {
                    }
                }
            }

            for (const entry of trimmed) collected.push({ ...entry, _storageKey: key });
        }

        // Global cap (keep newest across all keys)
        collected.sort((a, b) => getTs(a) - getTs(b));
        setLogs(collected.slice(-MAX_TOTAL));
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    return { logs, reload };
};

export default usePersistedLogs;
