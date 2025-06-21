import React from "react";
import { Box } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";
import Footer from "./Footer";

type LayoutProps = {
  body: React.ReactNode;
};

const Layout = ({ body }: LayoutProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100dvh"
      position="relative"
    >
      <ResponsiveAppBar />
      <Box
        component="main"
        position="relative"
        p={1}
        flexGrow={1}
        display="flex"
        flexDirection="column"
      >
        {body}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
