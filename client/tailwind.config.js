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
        "website-bg":"#202020",
        "ui-bg":"#303030"
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn': {
          '@apply hover:bg-primary-hover mx-auto mt-5 bg-primary font-bold py-2 px-4 rounded-full':{},
          transition: 'background-color 0.2s ease',
        },
      });
    },
  ],
}

