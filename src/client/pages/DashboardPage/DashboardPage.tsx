import React from "react";
import { Stack } from "@mui/material";
import CurrentReservationsWidget from "@client/components/CurrentReservationsWidget";
import GroupsWidget from "@client/components/ResourceGroupsWidget";
import useService from "./DashboardService";
import ControllerLayout from "@client/components/ControllerLayout";

const DashboardPage = () => {
  const { data, isPending, error } = useService();

  return (
    <ControllerLayout isPending={isPending} error={error}>
      <Stack
        spacing={2}
        direction="row"
        sx={{
          width: "99dvw",
          height: "81dvh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CurrentReservationsWidget data={data.reservationData} />
        <GroupsWidget data={data.groupData} />
      </Stack>
    </ControllerLayout>
  );
};

export default DashboardPage;
