/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090b10",
        paper: "#f4f2ee",
        accent: "#b9f35a",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
