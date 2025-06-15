import React from "react";
import {
  AppBar,
  Box,
  Link,
  Avatar,
  Button,
  Container,
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
import { useAuth } from "@client/AuthContext";
import { useThemeMode } from "@client/ThemeModeContext";
// @ts-expect-error: react fucks it up
import Logo from "./logo.svg?react";

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

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl" disableGutters>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Left side: Logo */}
          <Stack direction="row" spacing={2} alignItems="center">
            <a href={import.meta.env.BASE_URL}>
              <Logo style={{ height: 64, display: "block", padding: "8px" }} />
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
                    <Avatar src={user.picture} alt={user.name} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
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
      </Container>
    </AppBar>
  );
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "background.paper" }}
    >
      <Container maxWidth="xl">
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
      </Container>
    </Box>
  );
};

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
          {" "}
          <Footer />
        </footer>
      </>
    </Box>
  );
};

export default Layout;
