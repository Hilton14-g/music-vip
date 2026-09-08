/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#08090d',
          card: 'rgba(25, 27, 38, 0.65)',
          hover: 'rgba(255, 255, 255, 0.08)'
        },
        brand: {
          cyan: '#00f2fe',
          purple: '#7928ca',
          pink: '#ff007a',
          emerald: '#10b981',
          gold: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-bar': 'wave-bar 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'wave-bar': {
          '0%': { height: '15%' },
          '100%': { height: '95%' }
        }
      }
    },
  },
  plugins: [],
}
