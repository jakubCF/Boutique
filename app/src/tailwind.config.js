const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a202c", // Dark gray
        secondary: "#2d3748", // Slightly lighter gray
        accent: "#4a5568", // Accent color
        background: "#edf2f7", // Light background
        foreground: "#2d3748", // Text color
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      borderRadius: {
        md: "0.375rem",
      },
    },
  },
  plugins: [],
};