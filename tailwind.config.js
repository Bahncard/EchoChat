/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 这行很重要
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
     theme: {
       extend: {},
     },
     plugins: [],
   }