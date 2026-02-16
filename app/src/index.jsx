import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";
import "./assets/styles/global.css";

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (sentryDsn) {
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

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);
