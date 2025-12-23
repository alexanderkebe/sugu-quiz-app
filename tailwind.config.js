/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#EEC130',
        burgundy: '#640C1C',
        'off-white': '#F5F5F0',
        'light-gold': '#F4E4A6',
      },
      fontFamily: {
        nokia: ['var(--font-nokia)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

