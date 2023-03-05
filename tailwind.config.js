/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    fontFamily: {
      sans: ['system-ui', 'sans-serif'],
      serif: ['Cochin', 'Georgia', 'serif'],
    },
    extend: {
      colors: {
        ddfLightblue: '#00a5e7',
        ddfDarkblue: '#001727',
        ddfRed: '#c50009',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
