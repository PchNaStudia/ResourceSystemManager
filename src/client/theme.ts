import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface TypeText {
    hint: string | undefined;
  }
}

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: {
          main: "#3d0665",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#b0b0b0",
          contrastText: "#000000",
        },
        divider: "#10becb",
        text: {
          primary: "rgb(0, 0, 0)",
          secondary: "rgba(0, 0, 0, 0.6)",
          disabled: "rgba(0, 0, 0, 0.38)",
          hint: "rgb(16, 190, 203)",
        },
        background: {
          default: "#ebebeb",
        },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#d19af9",
          contrastText: "#000000",
        },
        secondary: {
          main: "#4f4f4f",
          contrastText: "#ffffff",
        },
        divider: "#34e2ef",
        text: {
          primary: "rgb(255, 255, 255)",
          secondary: "rgba(255, 255, 255, 0.6)",
          disabled: "rgba(255, 255, 255, 0.38)",
          hint: "rgb(52, 226, 239)",
        },
        background: {
          default: "#141414",
        },
      },
    },
  },
  typography: {
    fontFamily: "IBM Plex Sans",
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
    fontWeightLight: 300,
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  defaultColorScheme: "dark",
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          padding: 0,
          margin: 0,
        },
      },
    },
  },
});

export default theme;
