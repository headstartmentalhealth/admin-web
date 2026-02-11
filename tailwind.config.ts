import type { Config } from 'tailwindcss';
const flowbite = require('flowbite-react/tailwind');

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite/**/*.js',
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ['Gilroy', 'sans-serif'],
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      colors: {
        black: {
          1: '#00214F',
          2: '#344054',
        },
        primary: {
          main: '#13274f',
          '100': '#13274f',
          '200': '#13274f',
          '300': '#13274f',
          '400': '#13274f',
          '500': '#13274f',
          '600': '#13274f',
          '700': '#13274f',
          '800': '#13274f',
          '900': '#13274f',
          '950': '#13274f',
        },
        secondary: {
          main: '#13274f',
          'main-hover': '#13274f',
          'main-active': '#13274f',
        },
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        'premium-xl': '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
    flowbite.plugin(),
  ],
};
export default config;
