/** @type {import('tailwindcss').Config} */
/**
 * Tailwind CSS configuration
 * @type {object}
 * @property {object} content - Files to scan for classes
 * @property {object} theme - Theme customization
 * @property {Array} plugins - Tailwind plugins
 */
module.exports = {
    content: [
        "./src/*.{js,jsx,ts,tsx,html}",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./src/**/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "var(--primary)",
                "secondary": "var(--secondary)",
                "primary-hover": "var(--primary-hover)",
                "text-subtle": "var(--text-subtle)",
                "far-bg": "var(--far-bg)",
                "website-bg": "var(--website-bg)",
                "ui-bg": "var(--ui-bg)",
                "ui-bg-selected": "var(--ui-bg-selected)",
                "ui-default": "var(--ui-default)",
                "ui-button": "var(--ui-button)",
                "ui-button-hover": "var(--ui-button-hover)",
                "ui-border": "var(--ui-border)",
                "ui-border-selected": "var(--ui-border-selected)",
                "ui-subtle": "var(--ui-subtle)",
                "text": "var(--text)",
                "text-on-primary": "var(--text-on-primary)",
                "dangerous": "var(--dangerous)",
                "success": "var(--success)",

                "log-debug-border": "var(--log-debug-border)",
                "log-debug-bg": "var(--log-debug-bg)",
                "log-debug-text": "var(--log-debug-text)",

                "log-info-border": "var(--log-info-border)",
                "log-info-bg": "var(--log-info-bg)",
                "log-info-text": "var(--log-info-text)",

                "log-warn-border": "var(--log-warn-border)",
                "log-warn-bg": "var(--log-warn-bg)",
                "log-warn-text": "var(--log-warn-text)",

                "log-error-border": "var(--log-error-border)",
                "log-error-bg": "var(--log-error-bg)",
                "log-error-text": "var(--log-error-text)",

                "log-fatal-border": "var(--log-fatal-border)",
                "log-fatal-bg": "var(--log-fatal-bg)",
                "log-fatal-text": "var(--log-fatal-text)",

                "log-default-border": "var(--log-default-border)",
                "log-default-bg": "var(--log-default-bg)",
                "log-default-text": "var(--log-default-text)"
            },
            fontSize: {
                h1: "32.5px",
                h2: "29px",
                h3: "25.5px",
                h4: "23px",
                h5: "20px",
                h6: "18px",
                regular: "16px",
                small: "14px",
                tiny: "12.5px",
            },
        },
    },
    plugins: [
        function ({addComponents}) {
            addComponents({
                '.btn': {
                    '@apply hover:bg-primary-hover hover:cursor-pointer mx-auto bg-primary font-bold py-2 px-4 rounded-lg': {},
                    transition: 'background-color 0.2s ease',
                },
            });
        },
    ],
}

