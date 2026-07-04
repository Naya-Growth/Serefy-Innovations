/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '376px',
        'md': '481px',
        'lg': '769px',
        'xl': '1025px',
        '2xl': '1367px',
        '3xl': '1601px',
        '4xl': '1921px',
      },
    },
  },
  plugins: [],
}
