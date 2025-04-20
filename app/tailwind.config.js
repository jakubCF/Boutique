module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
          primary: "var(--primary)",
          "primary-foreground": "var(--primary-foreground)",
          secondary: "var(--secondary)",
          "secondary-foreground": "var(--secondary-foreground)",
          muted: "var(--muted)",
          "muted-foreground": "var(--muted-foreground)",
          border: "var(--border)",
          input: "var(--input)",
          ring: "var(--ring)",
        },
      },
    },
    plugins: [],
  };