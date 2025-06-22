import React from "react";
import { Box } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";
import Footer from "./Footer";
import { Outlet } from "react-router";

const Layout = () => {
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
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
