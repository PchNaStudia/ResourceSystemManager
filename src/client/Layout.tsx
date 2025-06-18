import React from "react";
import { Box, } from "@mui/material";
import ResponsiveAppBar from "@client/navBar";
import Footer from "@client/siteFooter";

type LayoutProps = {
  body: React.ReactNode;
};

const Layout = ({ body }: LayoutProps) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <>
        <ResponsiveAppBar />
        <main style={{ minHeight: "100dvh" }}>{body}</main>
        <footer>
          <Footer />
        </footer>
      </>
    </Box>
  );
};

export default Layout;
