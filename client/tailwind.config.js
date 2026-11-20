/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F4EFE5',
        burgundy: {
          DEFAULT: '#632F3D',
          dark: '#4a222e',
          light: '#7e3d4f',
          50: '#fbf7f8',
          100: '#f5edef',
          200: '#eddde1',
          300: '#dcb8c2',
          400: '#a3546a',
          500: '#632F3D',
          600: '#532733',
          700: '#432029',
          800: '#32181f',
          900: '#211015'
        },
        forest: {
          DEFAULT: '#263D35',
          dark: '#1b2c26',
          light: '#355348'
        },
        brass: {
          DEFAULT: '#B49A68',
          dark: '#937b4f',
          light: '#cbb68d'
        },
        charcoal: {
          DEFAULT: '#302C2A',
          muted: '#615c58',
          light: '#8a8480'
        },
        parchment: {
          DEFAULT: '#E6D9C5',
          light: '#efe5d5',
          dark: '#dacaba'
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        editorial: ['"Playfair Display"', 'serif'],
        reading: ['Lora', 'serif'],
        sans: ['"DM Sans"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
