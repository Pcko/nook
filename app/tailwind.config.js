/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx,html}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        "primary": "var(--primary)",
        "secondary": "var(--secondary)",
        "primary-hover": "var(--primary-hover)",
        "text-subtle": "var(--text-subtle)",
        "far-bg": "var(--far-bg)",
        "website-bg": "var(--website-bg)",
        "ui-bg": "var(--ui-bg)",
        "ui-bg-selected": "var(--ui-bg-selected)",
        "ui-border": "var(--ui-border)",
        "ui-border-selected": "var(--ui-border-selected)",
        "ui-subtle": "var(--ui-subtle)",
        "text": "var(--text)"
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn': {
          '@apply hover:bg-primary-hover hover:cursor-pointer mx-auto bg-primary font-bold py-2 px-4 rounded-lg':{},
          transition: 'background-color 0.2s ease',
        },
      });
    },
  ],
}

