/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Open Sans', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff5f5',
          100: '#ffe8e8',
          200: '#ffd5d5',
          300: '#ffb3b3',
          400: '#ff8888',
          500: '#FF5555',
          600: '#e63939',
          700: '#cc2e2e',
          800: '#b32424',
          900: '#991a1a',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#a8e6cf',
          600: '#7dd3a0',
          700: '#5fb885',
          800: '#4a9669',
          900: '#3d7a54',
        },
      },
    },
  },
  plugins: [],
}
