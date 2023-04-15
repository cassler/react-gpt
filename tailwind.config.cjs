/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "soothing-blue": "#013760",
        "regal-violet": "#5C2275",
        "neutral-gray": "#565A5C",
        black: "#000000",
        "savage-magenta": "#DE1B83",
        "unique-violet": "#80379B",
        "optimistic-orange": "#F64D05",
        "cool-blue": "#CDEEFE",
        "genuine-gray": "#9A9C9D",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
