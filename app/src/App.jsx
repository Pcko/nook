import React, { useEffect } from "react";

import "./index.css";
import { initThemeFromStorage } from "./app/bootstrap/themeInit";
import AppProviders from "./app/providers/AppProviders";
import AppRouter from "./app/router/AppRouter";

/**
 * Renders the app component.
 * @returns {JSX.Element} The rendered app component.
 */
function App() {
    useEffect(() => {
        initThemeFromStorage();
    }, []);

    return (
        <AppProviders>
            <AppRouter />
        </AppProviders>
    );
}

export default App;
