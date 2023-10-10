module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    daisyui : {
      themes: ["business"]
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],  }