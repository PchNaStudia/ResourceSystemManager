import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { useAuth } from "@client/AuthContext";
import { z } from "zod";
import ValidateRoute from "@client/components/ValidatedRouteParams";
import HomePage from "@client/pages/HomePage";
import AuthBased from "@client/components/AuthBased";
import DashboardPage from "@client/pages/DashboardPage/DashboardPage";
import ReservationsPage from "@client/pages/ReservationsPage/ReservationsPage";
import Layout from "@client/Layout";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import GroupPage from "@client/pages/GroupPage/GroupPage";
import NotFoundPage from "@client/pages/NotFoundPage";

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
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route
                path="/group/:id"
                element={
                  <ValidateRoute
                    paramValidator={z.object({ id: z.coerce.number().int() })}
                    element={({ id }) => <GroupPage id={id} />}
                    invalid={<NotFoundPage />}
                  />
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </LocalizationProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
