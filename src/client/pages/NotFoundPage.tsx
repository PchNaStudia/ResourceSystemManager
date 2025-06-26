import React from "react";
import { Stack, Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Stack
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Stack direction="row" spacing={2}>
        <Typography variant="h1">404</Typography>
        <Typography variant="h2">Page not found</Typography>
      </Stack>
    </Stack>
  );
};

export default NotFoundPage;
