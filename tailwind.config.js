module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wesPink: "#f4cccc",
        wesBlue: "#a2c4c9",
        wesYellow: "#fff2cc",
        wesBrown: "#4a3f35",
        wesPeach: "#f7d9b9",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "serif"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
    },
  },
  plugins: [],
};
