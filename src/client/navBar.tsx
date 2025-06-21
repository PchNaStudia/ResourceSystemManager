import React from "react";
import {
  AppBar,
  Avatar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useAuth } from "./AuthContext";
import { useThemeMode } from "./ThemeModeContext";
// @ts-expect-error: react fucks it up
import Logo from "./Logo.svg?react";

const settings = ["Account", "Logout"];

const ResponsiveAppBar = () => {
  const { user, login, logout } = useAuth();
  const { themeMode, setThemeMode } = useThemeMode();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { theme } = useThemeMode();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Box sx={{ width: "100%", m: 0, p: 0 }}>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <a href={import.meta.env.BASE_URL}>
              <Logo
                style={{
                  height: 64,
                  display: "block",
                  padding: "8px",
                  color: theme.palette.text.primary,
                }}
              />
            </a>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={() =>
                setThemeMode((prev) => (prev === "light" ? "dark" : "light"))
              }
            >
              {themeMode === "light" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeIcon />
              )}
            </IconButton>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, paddingRight: "16px" }}
                  >
                    <Avatar src={user.picture} alt={user.displayName} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  anchorEl={anchorElUser}
                  open={!!anchorElUser}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu();
                        if (setting === "Logout") logout();
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button onClick={login}>Login</Button>
            )}
          </Stack>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default ResponsiveAppBar;
