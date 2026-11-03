/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Playfair Display", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        paper: "#F3EFE6",
        ink: "#24231F",
        clay: "#873F32",
        olive: "#74745D",
      },
    },
  },
  plugins: [],
};
