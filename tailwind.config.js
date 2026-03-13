/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': 'var(--pbg)',
        'secondary-bg': 'var(--sbg)',
        'border-color': 'var(--sbord)',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
