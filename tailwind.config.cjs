/** @type {import('tailwindcss').Config} */
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
        green: '#00a843',
        red: '#f13e3a',
        blue: '#418ce1',
        gray: '#f5f5f6',
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
  plugins: [require('@tailwindcss/typography')],
};
118, 170, 98;
