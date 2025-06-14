import React from "react";
import { useAuth } from "@client/AuthContext";
import { Avatar, Button, IconButton, Link, Stack } from "@mui/material";
import { useThemeMode } from "@client/ThemeModeContext";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
// @ts-expect-error: ?react fucks it up
import Logo from "./logo.svg?react";

type LayoutProps = {
  body: React.ReactNode;
};

const Layout = ({ body }: LayoutProps) => {
  const { user, login, logout } = useAuth();
  const {themeMode, setThemeMode} = useThemeMode();

  return (
    <>
      {/* TODO: Create real navbar*/}

      <nav
        style={{ display: "flex", justifyContent: "space-between", padding: 8, height: 64 }}
      >
        <Stack direction="row" spacing={2}>
          <Link href={import.meta.env.BASE_URL}><Logo/></Link>
        </Stack>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={()=>setThemeMode((old)=> old === 'light' ? 'dark' : 'light')}>
            {themeMode === 'light' ? <DarkModeOutlinedIcon  /> : <LightModeIcon />}
          </IconButton>
          <Button onClick={user !== null ? logout : login}>
            {user ? <Avatar src={user.picture}/> : "Login"}
          </Button>
        </Stack>
      </nav>
      <main>{body}</main>
      {/* TODO: Add footer*/}
      <footer></footer>
      {/* TODO: Add allow cookies*/}
    </>
  );
};

export default Layout;
