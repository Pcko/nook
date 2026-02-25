import * as Sentry from "@sentry/react";

export function initSentry() {
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

    if (!sentryDsn) {
        return;
    }

    Sentry.init({
        dsn: sentryDsn,
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
