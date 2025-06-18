import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import Layout from "./Layout";
import AuthProvider from "@client/AuthContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import ThemeModeProvider, { useThemeMode } from "@client/ThemeModeContext";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";

const queryClient = new QueryClient();

const ThemedLayout = () => {
  const { theme } = useThemeMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout body={<Routes />} />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeModeProvider>
          <ThemedLayout />
        </ThemeModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
