/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "sesac-green": "rgba(24,123,70,0.7)",
        "sesac-sub": "#B3E56A"
      },
      keyframes: {
        intro: {
          from: { opacity: "0", transform: "translateX(-20%)" },
          to: { opacity: "1", transform: "translateX(0)", }
        },
        hide: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(-20%)" }
        },
      },
      animation: {
        intro: "intro .7s ease-in-out forwards",
        hide: "hide .7s ease-in-out forwards"
      }
    },
  },
  mode: "jit",
  plugins: [],
}

