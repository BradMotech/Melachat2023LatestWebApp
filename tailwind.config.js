/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:"class",
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}',"./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {spacing: {
      '128': '32rem',
      '144': '36rem',
    },
    borderRadius: {
      '4xl': '2rem',
    }},
  },
  plugins: [ require('flowbite/plugin')],
 }