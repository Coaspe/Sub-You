module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: { min: "100px", max: "768px" },
      md: { min: "769px", max: "1023px" },
      lg: { min: "1024px", max: "1279px" },
      xl: { min: "1280px", max: "1535px" },
      "2xl": { min: "1536px" },
    },
    extend: {
      fontFamily: {
        serif: "Merriweather",
        noto: "Noto Serif KR",
        stix: "STIX Two Text",
      },
      colors: {
        main: "#736578",
        white: "#ffffff",
      },
      height: {
        bgpost: "650px",
        smpost: "450px",
      },
      maxWidth: {
        "1/3": "33%",
      },
    },
  },
  variants: {},
  plugins: [],
};
