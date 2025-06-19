import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { useAuth } from "@client/AuthContext";

const RouteAccessControl = () => {
  const { user, login } = useAuth();
  if (!user) {
    login();
    return <>Redirecting to login...</>;
  }
  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/*TODO: Move pages separate component*/}
        <Route path="/" element={<div>Home</div>} />
        <Route element={<RouteAccessControl />}>
          <Route path="/web" element={<div>Web</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
