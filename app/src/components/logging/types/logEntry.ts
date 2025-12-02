import {LogLevel} from "./logLevel.ts";

export interface LogEntry {
    id: string;
    level: LogLevel;
    message: string;
    meta?: unknown;
    timestamp: string;
    sessionId: string;
    userId: string | null;
    route: string | null;
    _storageKey?: string;
}