/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8DFCD",
        blush: "#F6F0EC",
        berry: "#A4435A",
        lavender: "#8D95AB",
        redpop: "#EC2A42",
      },
      fontFamily: {
        gotham: ["Gotham", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
