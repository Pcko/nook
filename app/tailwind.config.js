/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx,html}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        "primary":"#6B439B",
        "secondary":"#8869AD",
        "primary-hover":"#5A3382",
        "website-bg":"#101012",
        "ui-bg":"#17181B",
        "ui-border":"#2D3036",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn': {
          '@apply hover:bg-primary-hover mx-auto bg-primary font-bold py-2 px-4 rounded-full':{},
          transition: 'background-color 0.2s ease',
        },
      });
    },
  ],
}

