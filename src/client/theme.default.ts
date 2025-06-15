import { ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeText {
    hint: string | undefined;
  }
}

export const defaultThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: "IBM Plex Sans",
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
    fontWeightLight: 300,
    h1: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 700,
      fontSize: "4.210rem", // 67.36px
    },
    h2: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 700,
      fontSize: "3.158rem", // 50.56px
    },
    h3: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 700,
      fontSize: "2.369rem", // 37.92px
    },
    h4: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 700,
      fontSize: "1.777rem", // 28.48px
    },
    h5: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 400,
      fontSize: "1.333rem", // 21.28px
    },
    body1: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 400,
      fontSize: "1rem", // 16px by default
    },
    caption: {
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 400,
      fontSize: "0.750rem", // 12px
    },
  },
};
