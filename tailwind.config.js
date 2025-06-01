// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./*.{vue,js,ts}" // Added to catch files directly in root like app.vue
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};