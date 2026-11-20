/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Page background: warm, luminous cream
        ivory: '#FFF8F0',

        // Rose-magenta: primary brand colour (was burgundy)
        burgundy: {
          DEFAULT: '#D6336C',
          dark: '#A61E4D',
          light: '#F06595',
          50: '#FFF0F6',
          100: '#FFDEEB',
          200: '#FCC2D7',
          300: '#FAA2C1',
          400: '#F06595',
          500: '#D6336C',
          600: '#C2255C',
          700: '#A61E4D',
          800: '#80173B',
          900: '#5C0F2B'
        },

        // Electric violet: the "iris" (new)
        iris: {
          DEFAULT: '#7048E8',
          dark: '#5F3DC4',
          light: '#9775FA',
          50: '#F3F0FF',
          100: '#E5DBFF',
          200: '#D0BFFF',
          300: '#B197FC',
          400: '#9775FA',
          500: '#7048E8',
          600: '#6741D9',
          700: '#5F3DC4',
          800: '#4C2FA3',
          900: '#3B2480'
        },

        // Fresh emerald-teal (was forest)
        forest: {
          DEFAULT: '#099268',
          dark: '#087F5B',
          light: '#20C997'
        },

        // Sunny gold (was brass)
        brass: {
          DEFAULT: '#FAB005',
          dark: '#F08C00',
          light: '#FFD43B'
        },

        // Sky-cyan accent (new)
        sky: {
          DEFAULT: '#15AABF',
          dark: '#0C8599',
          light: '#3BC9DB'
        },

        // Deep indigo ink for text (was charcoal)
        charcoal: {
          DEFAULT: '#2B2A4C',
          muted: '#5C5A85',
          light: '#8F8DB5'
        },

        // Peachy cream surfaces
        parchment: {
          DEFAULT: '#FFE8CC',
          light: '#FFF4E6',
          dark: '#FFD8A8'
        }
      },

      backgroundImage: {
        'grad-iris': 'linear-gradient(135deg, #7048E8 0%, #D6336C 55%, #FAB005 100%)',
        'grad-sunrise': 'linear-gradient(135deg, #FF8787 0%, #FAB005 100%)',
        'grad-aurora': 'linear-gradient(135deg, #15AABF 0%, #7048E8 50%, #D6336C 100%)',
        'grad-meadow': 'linear-gradient(135deg, #20C997 0%, #15AABF 100%)',
        'grad-dusk': 'linear-gradient(180deg, #2B2A4C 0%, #7048E8 100%)',
        'grad-page':
          'radial-gradient(at 8% 0%, #FFD8A8 0, transparent 45%), radial-gradient(at 92% 8%, #D0BFFF 0, transparent 45%), radial-gradient(at 50% 100%, #FCC2D7 0, transparent 50%)'
      },

      boxShadow: {
        glow: '0 10px 40px -10px rgba(112, 72, 232, 0.45)',
        'glow-rose': '0 10px 40px -10px rgba(214, 51, 108, 0.45)'
      },

      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite'
      },

      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        editorial: ['"Playfair Display"', 'serif'],
        reading: ['Lora', 'serif'],
        sans: ['"DM Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
}