/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          blue: "#0244bc",
          dark: "#001844",
          light: "#f0f4f9",
          border: "#e2e8f0",
          card: "#ffffff",
          text: "#1e293b",
          muted: "#64748b",
        },
      },
    },
  },
  plugins: [],
};
