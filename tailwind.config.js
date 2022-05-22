module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "8xl":"1920px"
      },
      opacity: ["disabled"],
      cursor: ["disabled"],
      flex: {
        "2": "2 2 0%"
      },
    },
  },
  plugins: [],
}
