/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'sesac-green': 'rgba(24,123,70,0.7)'
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%, -25%': { transform: 'translateX(-15px)' },
          '75%': { transform: 'translateX(15px)' },
        }
      },
      animation: {
        'spin-shake': 'shake 0.5s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}

