/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        18: '4.5rem',
      },
      screens: {
        '2xs': '300px',
        xs: '345px',
      },
    },
  },
  plugins: [],
}