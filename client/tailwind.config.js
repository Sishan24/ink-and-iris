/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F5EF',
        parchment: '#E8DFC9',
        gold: { DEFAULT: '#B9955D', deep: '#8A6A33' }, // deep = readable on ivory for text
        sage: { DEFAULT: '#71816D', deep: '#4F5E4B' },
        rose: { DEFAULT: '#B77D78', deep: '#8F5551' },
        forest: '#293A35',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 10px 30px -12px rgba(41,58,53,.22)' },
    },
  },
  plugins: [],
};
