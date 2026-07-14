/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        primary: {
          DEFAULT: '#00f0ff',
          glow: 'rgba(0, 240, 255, 0.15)',
        },
        secondary: {
          DEFAULT: '#9945ff',
          glow: 'rgba(153, 69, 255, 0.15)',
        },
        dark: {
          100: '#0a0a0a',
          200: '#121212',
          300: '#1a1a1a',
        },
        neonBlue: '#00f0ff',
        neonPurple: '#9945ff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 3s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
