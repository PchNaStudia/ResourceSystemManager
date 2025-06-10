import React from "react";
import { useAuth } from "@client/AuthContext";

type LayoutProps = {
  body: React.ReactNode;
};

const Layout = ({ body }: LayoutProps) => {
  const { user, login, logout } = useAuth();
  return (
    <>
      {/* TODO: Create real navbar*/}
      <nav
        style={{ display: "flex", justifyContent: "space-between", padding: 1 }}
      >
        <div></div>
        <button onClick={user !== null ? logout : login}>
          {user ? "Logout" : "Login"}
        </button>
      </nav>
      <main>{body}</main>
      {/* TODO: Add footer*/}
      <footer></footer>
      {/* TODO: Add allow cookies*/}
    </>
  );
};

export default Layout;
