
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8c30e8',
        'background-light': '#f7f6f8',
        'background-dark': '#191121',
        'surface-light': '#ffffff',
        'surface-dark': '#231b2e'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)'
      }
    }
  },
  plugins: []
}
