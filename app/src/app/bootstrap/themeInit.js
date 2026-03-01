export function initThemeFromStorage() {
    const accessibilityMode = localStorage.getItem("accessibility");
    let theme = localStorage.getItem("theme");

    const root = document.documentElement;
    root.classList.remove("light", "dark", "high-contrast");

    if (!theme) {
        theme = "system";
        localStorage.setItem("theme", theme);
    }

    if (accessibilityMode === "high-contrast") {
        root.classList.add("high-contrast");
    }

    if (theme === "system") {
        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            root.classList.add("light");
        } else {
            root.classList.add("dark");
        }
        return;
    }

    root.classList.add(theme);
}

export default initThemeFromStorage;
