import * as Sentry from "@sentry/react";

export function isSentryEnabled() {
    const env = import.meta.env;
    const sentryDsn = env.VITE_SENTRY_DSN;
    if (!sentryDsn) return false;

    return !env.DEV;
}

export function initSentry() {
    if (!isSentryEnabled()) {
        return;
    }

    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        sendDefaultPii: true,
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
        ],
        tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
        replaysSessionSampleRate: import.meta.env.DEV ? 0.2 : 0.05,
        replaysOnErrorSampleRate: 1.0,
    });
}

export default initSentry;
