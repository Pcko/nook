/**
 * LoggerContext.js
 *
 * A simple, safe logging context for React applications.
 */

import {createContext, useContext, useState, useCallback, useEffect} from "react";

/**
 * Create a React context for logging.
 */
const LoggerContext = createContext();

/**
 * Custom hook to access the logger context.
 * @returns {{ logs: Array, log: Function, clearLogs: Function }}
 */
export const useLogger = () => useContext(LoggerContext);

/**
 * Provides a logging context to the entire application.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const LoggerProvider = ({children}) => {
    const [logs, setLogs] = useState([]);

    /**
     * Adds a new log entry.
     * @param {"info" | "warn" | "error" | "fatal" | string} level
     * @param {string} message
     * @param {Object} [meta={}]
     * @returns {Function} cleanup function
     */
    const log = useCallback((level, message, meta = {}) => {
        const timestamp = new Date().toISOString();
        const entry = {
            id: `${timestamp}-${Math.random()}`,
            level,
            message,
            meta,
            timestamp
        };

        setLogs(prev => [...prev, entry]);

        if (import.meta.env.VITE_ENV === "dev") {
            console[level] ? console[level](message, meta) : console.log(message, meta);
        }

        // Return a cleanup function (optional)
        return () => {
            persist_log(entry, meta)
                .then(() => clearLogs())
                .catch(err => console.error("Log persistence failed:", err));
        };
    }, []);

    /**
     * Persist logs to localStorage every 60 seconds automatically.
     */
    useEffect(() => {
        const interval = setInterval(() => {
            if (logs.length > 0) {
                persist_log(logs).catch(console.error);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [logs]);

    /**
     * Clears all logs from memory.
     */
    const clearLogs = () => setLogs([]);

    /**
     * Persists log(s) to localStorage.
     * @param {Object|Array} message
     * @param {Object} [meta={}]
     */
    const persist_log = async (message, meta = {}) => {
        const key = `${meta.context || "app"}_logs`;
        const existingLogs = JSON.parse(localStorage.getItem(key) ?? "[]");

        const updatedLogs = Array.isArray(message)
            ? [...existingLogs, ...message]
            : [...existingLogs, message];

        localStorage.setItem(key, JSON.stringify(updatedLogs));
    };

    return (
        <LoggerContext.Provider value={{logs, log, clearLogs}}>
            {children}
        </LoggerContext.Provider>
    );
};