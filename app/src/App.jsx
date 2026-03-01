import React, { useEffect } from "react";

import "./index.css";
import AppProviders from "./app/providers/AppProviders";
import AppRouter from "./app/router/AppRouter";
import { initThemeFromStorage } from "./app/bootstrap/themeInit";

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
