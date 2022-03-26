import { useState, useEffect } from "react";
import Footer from "./menues/Footer";
import Nav from "./menues/Nav";
// import { ThemeProvider, useTheme, createTheme } from "@mui/material/styles";

// const getDesignTokens = (mode) => ({
//   palette: {
//     mode,
//     primary: {
//       ...(mode === "dark" && {
//         main: "",
//       }),
//     },
//     ...(mode === "dark" && {
//       background: {
//         default: "",
//         paper: "",
//       },
//     }),
//     text: {
//       ...(mode === "light"
//         ? {
//             primary: "",
//             secondary: "",
//           }
//         : {
//             primary: "#fff",
//             secondary: "",
//           }),
//     },
//   },
// });

const Layout = ({ handleDark, dark, children }) => {

  useEffect(() => {
    console.log(dark);
  }, []);

  return (
    <div
      className={`${
        dark
          ? "dark transition-all duration-700 ease-in-out"
          : "light transition-all duration-700 ease-in-out"
      } w-full transition-all duration-700 ease-in-out`}
    >
      <Nav handleDark={handleDark} dark={dark} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
