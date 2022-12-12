/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.tsx',
    './src/modules/**/*.tsx',
    './src/common/components/**/*.tsx',
  ],
  theme: {
    fontFamily: {
      sans: ['system-ui', 'sans-serif'],
      serif: ['Cochin', 'Georgia', 'serif'],
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
