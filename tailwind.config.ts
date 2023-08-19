import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.tsx'],
  theme: {
    fontFamily: {
      sans: ['system-ui', 'sans-serif'],
      serif: ['Cochin', 'Georgia', 'serif'],
    },
    extend: {
      animation: {
        fadein: 'fade-in 200ms ease-in',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '100' },
        },
      },
      colors: {
        ddfLightblue: '#00a5e7',
        ddfDarkblue: '#001727',
        ddfRed: '#c50009',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
