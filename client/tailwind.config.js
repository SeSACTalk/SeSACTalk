/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "sesac-green": "rgba(24,123,70,0.7)",
        "sesac-dark-green": "#10502D",
        "sesac-sub": "#B3E56A",
        "sesac-sub-transparency": "rgba(179, 229, 106, 0.1)",
        "sesac-sub2":"#51AF69"
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%, -25%": { transform: "translateX(-15px)" },
          "75%": { transform: "translateX(15px)" },
        },
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
        "spin-shake": "shake 0.5s ease-in-out forwards",
        intro: "intro .7s ease-in-out forwards",
        hide: "hide .7s ease-in-out forwards"
      }
      , maxHeight: {
        "1/2": "50%",
      },
      boxShadow: {
        "min-nav": "8px 0px 5px 1px rgba(0,0,0,0.15)"
      },
    },
  },
  mode: "jit",
  plugins: [],
}