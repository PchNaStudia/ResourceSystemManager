import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { useAuth } from "@client/AuthContext";
import { z } from "zod";
import ValidateRoute from "@client/components/ValidatedRouteParams";
import HomePage from "@client/pages/HomePage";
import AuthBased from "@client/components/AuthBased";
import DashboardPage from "@client/pages/DashboardPage";
import ReservationsPage from "@client/pages/ReservationsPage/ReservationsPage";
import Layout from "@client/Layout";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <AuthBased
                  authedElement={<DashboardPage />}
                  unAuthedElement={<HomePage />}
                />
              }
            />
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
              <Route path="/reservations" element={<ReservationsPage />} />
            </Route>
          </Route>
        </Routes>
      </LocalizationProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
