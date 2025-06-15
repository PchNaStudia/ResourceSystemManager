import { defaultThemeOptions } from "@client/theme.default";
import { ThemeOptions } from "@mui/material/styles";

export const darkThemeOptions: ThemeOptions = {
  ...defaultThemeOptions,
  palette: {
    mode: "dark",
    primary: {
      main: "#3d0665",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4f4f4f",
      contrastText: "#ffffff",
    },
    divider: "#bbda4e",
    text: {
      primary: "rgb(255, 255, 255)",
      secondary: "rgba(255, 255, 255, 0.6)",
      disabled: "rgba(255, 255, 255, 0.38)",
      hint: "rgb(187, 218, 78)",
    },
    background: {
      default: "#141414",
    },
  },
};
