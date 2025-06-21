import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import Layout from "./Layout";
import AuthProvider from "@client/AuthContext";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import theme from "@client/theme";
import {CssBaseline, ThemeProvider} from "@mui/material";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <Layout body={<Routes />} />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
