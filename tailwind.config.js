/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      animation: {
        "pulse-fast": "pulse 500ms linear infinite",
      },
    },
  },
  plugins: [],
};
