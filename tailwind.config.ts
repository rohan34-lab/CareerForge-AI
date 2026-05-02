import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: '#4F46E5',
        accent: '#0EA5E9'
      }
    }
  },
  plugins: []
};

export default config;
