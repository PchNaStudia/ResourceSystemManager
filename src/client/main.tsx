import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import Layout from "./Layout";
import AuthProvider from "@client/AuthContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout body={<Routes />} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
