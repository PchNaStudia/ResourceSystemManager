import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { useAuth } from "@client/AuthContext";
import { z } from "zod";
import ValidateRoute from "@client/components/ValidatedRouteParams";

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
          <Route
            path="/test/:id"
            element={
              <ValidateRoute
                paramValidator={z.object({ id: z.coerce.number().int() })}
                element={({ id }) => <div>Test {id}</div>}
                invalid={<div>Invalid</div>}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
