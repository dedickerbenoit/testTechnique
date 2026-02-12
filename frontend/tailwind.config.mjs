/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7F2982",
          light: "#9769AD",
        },
        text: {
          primary: "#1C1C1C",
          secondary: "#444444",
        },
        background: {
          DEFAULT: "#F5F5F5",
        },
      },
    },
  },
  plugins: [],
};
