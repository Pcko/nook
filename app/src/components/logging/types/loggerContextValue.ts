import {LogEntry} from "./logEntry.ts";
import {LogLevel} from "./logLevel.ts";

export interface LoggerContextValue {
    logs: LogEntry[];
    persistedLogs: LogEntry[];
    combinedLogs: LogEntry[];
    log: (level: LogLevel, message: string, meta?: unknown) => string;
    clearLogs: () => void;
    reloadPersisted: () => void;
}
