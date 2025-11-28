import {useCallback, useEffect, useState} from "react";

const usePersistedLogs = () => {
    const [logs, setLogs] = useState([]);

    const reload = useCallback(() => {
        const collected = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key || !key.endsWith("_logs")) continue;

                const raw = localStorage.getItem(key);
                if (!raw) continue;

                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    parsed.forEach((entry) => {
                        collected.push({...entry, _storageKey: key});
                    });
                }
            }
        } catch (e) {
            console.error("Failed to read persisted logs:", e);
        }
        setLogs(collected);
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    return {logs, reload};
};

export default usePersistedLogs;