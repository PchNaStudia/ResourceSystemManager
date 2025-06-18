import React from "react";
import { Box, Paper, Typography, Stack } from "@mui/material";

const Homepage = () => {
  return (
    <Paper sx={{
      display: "flex",
      alignItems: "center",
      minHeight: "100vh",
      pl: 40,
    }}
    >
      <Box sx={{ p: 4, width: 500, height: 500, overflow: "auto" }}>
        <Typography variant="h2" gutterBottom>
          Manage Your Resources
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Effortlessly monitor, manage, and optimize your system resources — all through a powerful, developer-friendly API.
        </Typography>

        <Stack spacing={1} color="text.secondary" >
          <Typography>- Fast & Lightweight</Typography>
          <Typography>- Secure by Design</Typography>
          <Typography>- Real-Time Data</Typography>
          <Typography>- Scalable & Extensible</Typography>
        </Stack>
      </Box>
    </Paper>
  );
};

export default Homepage;
