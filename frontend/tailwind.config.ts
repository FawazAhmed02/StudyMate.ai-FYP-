import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: '#06113C',
        yellowHighlight: '#FFD700',
        loaderGray: '#E5E5E5',
        loaderBlue: '#3B82F6',
      },
      animation: {
        verticalLoader: 'slideDown 3s ease-in-out forwards',
      },
      keyframes: {
        slideDown: {
          '0%': { height: '0%' },
          '100%': { height: '100%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;