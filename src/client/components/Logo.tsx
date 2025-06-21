import React from "react";
import { Box, Stack, Typography } from "@mui/material";
// @ts-expect-error: react fucks it
import SvgLogo from "./Logo.svg?react";

type LogoProps = {
  height?: number;
  color?: string;
  withText?: boolean;
};

const Logo = ({
  height = 32,
  color = "primary.main",
  withText = false,
}: LogoProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1} height={height}>
      <Box height={height} sx={{ aspectRatio: 1, color }}>
        <SvgLogo />
      </Box>
      {withText && (
        <Stack>
          <Typography
            variant="body2"
            sx={{ fontSize: height / 2, lineHeight: 1, padding: 0, margin: 0 }}
          >
            Resource
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: height / 2, lineHeight: 1, padding: 0, margin: 0 }}
          >
            System Manager
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default Logo;
