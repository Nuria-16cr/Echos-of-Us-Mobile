/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#A4435A",
        secondary: "#8D95AB",
        accent: "#EC2A42",
        background: "#F8DFCD",
        light: "#F6F0EC",
      },
      fontFamily: {
        logo: ["Gotham Light", "sans-serif"],
        h1: ["Gotham", "sans-serif"],
        h2: ["Inter Semibold", "sans-serif"],
        h3: ["Inter Medium", "sans-serif"],
        p: ["Inter Regular", "sans-serif"],
        secondary: ["Inter Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
