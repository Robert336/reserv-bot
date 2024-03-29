import { createTheme, responsiveFontSizes, ThemeProvider } from "@material-ui/core";
import React from "react";
const theme = createTheme({
    palette: {
        primary: {
            main: "#EBB81A"
        }

    },
    typography: {
        fontFamily: "Work Sans",

        h1: {

        },
        h2: {

        },
        h3: {

        },
        h4: {
            fontFamily: "Work Sans",
            fontWeight: 700,
        },
        h5: {
            fontWeight: 500,
        }

    },

    shape: {
        borderRadius: 5
    }
});

// const theme = {
//     colors: {
//         black: "#000000",
//         white: "#FFFFFF",
//         lightBlue: "#00C2FF",
//         pink: "#B10DFF",
//         darkBlue: "#536EFF",
//         purple: "#37297F",
//         gold: "#EBB81A",
//         grey: "#404040",
//         mediumGrey: "#838383",
//         lightGrey: "#D4D4D4",
//         lightPurple: "#E6DFFF"
//     },

//     fonts: {
//         text: "Work Sans",
//         title: "Work Sans",
//         subTitle: "Work Sans",
//         header: "Work Sans",
//     },

//     fontSizes: {
//         small: "0.4rem",
//         smallMedium: "0.6rem",
//         mediumSmall: "0.84rem",
//         medium: "1rem",
//         mediumMedium: "1rem",
//         mediumLarge: "1.2rem",
//         largeMedium: "1.4rem",
//         large: "1.8rem",
//         largeLarge: "2.8rem",
//         extraLarge: "4rem",
//     },
// };

function Theme({ children }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default Theme;