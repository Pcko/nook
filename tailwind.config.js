/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
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
      spacing:{

      }
    },
  },
  plugins: [],
}

