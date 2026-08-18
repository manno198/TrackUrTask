/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Open Sans"', 'sans-serif'],
        body: ['"Open Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        chartreuse: {
          50: '#FBFFE8',
          100: '#F4FFC7',
          200: '#E8FF94',
          300: '#D5FF5A',
          400: '#C2EB3F',
          DEFAULT: '#D5FF5A',
        },
        forest: {
          DEFAULT: '#506B48',
          600: '#455C3D',
          700: '#3A4E34',
        },
        ink: '#0A0A0A',
        electric: '#2695F0',
        spring: '#32E348',
        flash: '#FFFF00',
      },
      boxShadow: {
        block: '4px 4px 0 0 #0A0A0A',
        'block-sm': '2px 2px 0 0 #0A0A0A',
        'block-electric': '3px 3px 0 0 #2695F0',
      },
    },
  },
  plugins: [],
}
