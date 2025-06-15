import * as React from "react";
import { createTheme, type Theme } from "@mui/material";
import { lightThemeOptions } from "@client/theme.light";
import { darkThemeOptions } from "@client/theme.dark";
import { useMemo } from "react";

type ThemeModeType = "light" | "dark";

type ThemeModeContextType = {
  theme: Theme;
  themeMode: ThemeModeType;
  setThemeMode: React.Dispatch<React.SetStateAction<ThemeModeType>>;
};

type ThemeModeProviderProps = {
  children: React.ReactNode;
};

export const ThemeModeContext =
  React.createContext<ThemeModeContextType | null>(null);

export const useThemeMode = () => {
  const context = React.useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

const ThemeModeProvider = ({ children }: ThemeModeProviderProps) => {
  const lightTheme = useMemo(() => createTheme(lightThemeOptions), []);
  const darkTheme = useMemo(() => createTheme(darkThemeOptions), []);

  const [themeMode, setThemeMode] = React.useState<ThemeModeType>("light");
  const theme = useMemo(
    () => (themeMode === "light" ? lightTheme : darkTheme),
    [themeMode],
  );

  return (
    <ThemeModeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeProvider;
