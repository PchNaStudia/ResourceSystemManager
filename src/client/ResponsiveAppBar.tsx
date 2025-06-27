import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useColorScheme,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useAuth } from "./AuthContext";
import Logo from "@client/components/Logo";
import { NavLink } from "react-router";

const settings = ["Account", "Logout"];

const ResponsiveAppBar = () => {
  const { user, login, logout } = useAuth();
  const { mode, setMode } = useColorScheme();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box
      component="header"
      px={1}
      pt={1}
      position="sticky"
      width="100%"
      top={0}
      zIndex={1000}
    >
      <AppBar
        component="nav"
        color="default"
        sx={{ p: 1, borderRadius: 2 }}
        variant="elevation"
        position="static"
      >
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Link
              href={import.meta.env.BASE_URL}
              color="text.primary"
              height={64}
              underline="none"
            >
              <Logo height={64} withText />
            </Link>
            <Stack direction="row" spacing={2} alignItems="center">
              {user && (
                <Chip
                  component={NavLink}
                  to="/reservations"
                  clickable
                  label="Reservation"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                  }}
                />
              )}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
            >
              {mode === "light" ? <DarkModeOutlinedIcon /> : <LightModeIcon />}
            </IconButton>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, paddingRight: 2 }}
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
              <Button onClick={login} variant="contained">
                Login
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ResponsiveAppBar;
