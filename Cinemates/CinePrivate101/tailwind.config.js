/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#663399', // Rebecca Purple
          light: '#8c68c9',
          dark: '#4a2570',
        },
        secondary: {
          DEFAULT: '#FFFFFF', // White
          dark: '#F0F0F0',
        },
        accent: {
          DEFAULT: '#FFD700', // Gold
          light: '#FFEB99',
          dark: '#B29700',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#A7F3D0',
          dark: '#065F46',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FDE68A',
          dark: '#B45309',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#B91C1C',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(102, 51, 153, 0.7)), url('/src/assets/theatre-bg.jpg')",
        'footer-pattern': "linear-gradient(to right, rgba(74, 37, 112, 0.9), rgba(74, 37, 112, 0.95))",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};