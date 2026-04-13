/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: '#2C1A0E',
        arabica: '#5C3D1E',
        gold: '#B8860B',
        cream: '#F5F0E8',
        parchment: '#EDE8DE',
        text: '#1A1A1A',
      },
    },
  },
  plugins: [],
}

