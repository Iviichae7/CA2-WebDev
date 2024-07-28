/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.js", "./public/**/*.css"],
  theme: {
    extend: {
      colors: {
        cream: "#F9F1F0",
        roseQuartz: "#FADCD9",
        dustyRose: "#F8AFA6",
        coral: "#F79489",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        fadeInChar: {
          "0%": { opacity: "0", transform: "translateX(-50%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInForm: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeInChar: "fadeInChar 0.5s ease-in-out forwards",
        fadeInForm: "fadeInForm 0.5s ease-in-out forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
