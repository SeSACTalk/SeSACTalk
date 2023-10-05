/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'sesac-green': 'rgba(24,123,70,0.7)',
        "sesac-sub": "#B3E56A",
        "sesac-sub-transparency" : "rgba(179, 229, 106, 0.1)"
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
      , maxHeight: {
        '1/2': '50%',
      },
    },
  },
  plugins: [],
}

