import {LogLevel} from "../../context/LoggerContext.tsx";

interface ShowNotificationOptions {
    autoHide?: boolean;
    duration?: number;
    logLevelOverride?: LogLevel;
    logMeta?: Record<string, unknown>;
}

export default ShowNotificationOptions;