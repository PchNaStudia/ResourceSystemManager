import React from "react";
import { Box, Link, Stack, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "background.paper" }}
    >
      <Box sx={{ width: "100%", m: 0, p: 0 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Resource System Manager
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="" underline="hover" color="inherit">
              Privacy Policy
            </Link>
            <Link href="" underline="hover" color="inherit">
              Terms of Service
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
