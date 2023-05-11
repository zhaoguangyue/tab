/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/**/*.{js,ts,jsx,tsx}',
    './src/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        green: {
          DEFAULT: '#00a843',
        },
        red: {
          DEFAULT: '#f13e3a',
        },
        blue: {
          DEFAULT: '#418ce1',
        },
        gray: {
          DEFAULT: '#f5f5f6',
        },
      },
    },
    spacing: {
      1: '5px',
      2: '10px',
      3: '15px',
      4: '20px',
      5: '25px',
      6: '30px',
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require('@tailwindcss/typography')],
};
118, 170, 98;
