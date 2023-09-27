/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'sesac-green': 'rgba(24,123,70,0.7)',
        'sesac-dark-green': '#10502D',
        "sesac-sub": "#B3E56A"
      },
    },
  },
  plugins: [],
}

