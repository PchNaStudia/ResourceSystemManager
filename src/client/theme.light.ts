import { defaultThemeOptions } from "@client/theme.default";
import { ThemeOptions } from "@mui/material/styles";

export const lightThemeOptions: ThemeOptions = {
  ...defaultThemeOptions,
  palette: {
    mode: "light",
    primary: {
      main: "#d19af9",
      contrastText: "#000000",
    },
    secondary: {
      main: "#b0b0b0",
      contrastText: "#000000",
    },
    divider: "#93b125",
    text: {
      primary: "rgb(0, 0, 0)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgb(147, 177, 37)",
    },
    background: {
      default: "#ebebeb",
    },
  },
};
