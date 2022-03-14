// tailwind.config.js
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          primary: "#0B0B0B",
          secondary: "rgba(242, 242, 242, 0.1)",
        },
        light: {
          primary: "#4B6989",
        },
        grey: {
          dark: "#BFC6D1",
          light: "#B6B6B6",
        },
        "white-bg": "rgba(250, 250, 250, 1)",
        "off-white": "#f2f2f2",
        CardBg: "rgba(191, 198, 209, 1)",
      },
      maxWidth: {
        container: "1200px",
        "2xl": "688px",
        170: "170px",
        268: "268px",
      },
      maxHeight: {
        700: "700px",
      },
      minHeight: {
        400: "400px",
        min: "min-content",
      },
      margin: {},
      width: {},
      backgroundImage: {},
      borderWidth: {},
      fontSize: {
        70: "70px",
        32: "32px",
        50: "50px",
        30: "30px",
        22: "22px",
        38: "38px",
      },
      boxShadow: {
        box: "0px 4px 8px rgba(0, 0, 0, 0.25)",
        smooth: "0px 20px 45px rgba(0, 0, 0, 0.1)",
        media: "0 0 0 0 rgba(44,177,188,.8)",
      },
      fontFamily: {
        sans: ['"TTNorms-Regular"', "system-ui"],
        serif: ['"TTNorms-Regular"', "system-ui"],
        body: ["sans"],
        display: ["sans"],
      },
      keyframes: {},
      animation: {},
      scale: {},
    },
  },
  variants: {
    extend: {
      scale: ["group-hover, hover"],
      transform: ["group-hover, hover"],
    },
  },
  plugins: [],
};
