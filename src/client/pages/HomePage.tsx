import React from "react";
import {Box, Stack, Typography} from "@mui/material";

const HomePage = () => {
  return (
    <Stack height="100%" flexGrow={1} justifyContent="center">
      <Box sx={{ p: 4, width: 500, height: 500 }}>
        <Typography variant="h2" gutterBottom>
          Manage Your Resources
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Effortlessly monitor, manage, and optimize your system resources — all
          through a powerful, developer-friendly API.
        </Typography>

        <Stack spacing={1} color="text.secondary">
          <Typography>- Fast & Lightweight</Typography>
          <Typography>- Secure by Design</Typography>
          <Typography>- Real-Time Data</Typography>
          <Typography>- Scalable & Extensible</Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export default HomePage;
