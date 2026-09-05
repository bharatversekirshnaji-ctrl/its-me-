/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#0F1808',
          800: '#16220E',
          DEFAULT: '#1E2D12',
          light: '#2A3C1B',
        },
        olive: {
          DEFAULT: '#39431E',
          light: '#4E5B2B',
          dark: '#2B3317',
        },
        cream: {
          DEFAULT: '#F4E9D5',
          light: '#FAF4EB',
          soft: '#FFF9EF',
          dark: '#E7D5BA',
        },
        gold: {
          DEFAULT: '#B28A4A',
          light: '#CBA768',
          dark: '#8C682E',
          muted: '#D4AF37',
        },
        espresso: {
          DEFAULT: '#4A321E',
          dark: '#2E1E12',
          light: '#65472E',
        },
        sand: '#D9C09A',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        script: ['"Alex Brush"', 'cursive'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(22, 34, 14, 0.15)',
        'luxury-hover': '0 20px 40px -15px rgba(22, 34, 14, 0.25)',
        'luxury-gold': '0 10px 30px -10px rgba(178, 138, 74, 0.25)',
        'glow': '0 0 25px rgba(178, 138, 74, 0.3)',
      },
      borderRadius: {
        'luxury': '14px',
      }
    },
  },
  plugins: [],
}
