import React from "react";
import useService from "./ReservationsService";
import { Card, CardHeader, Stack } from "@mui/material";
import ControllerLayout from "@client/components/ControllerLayout";
import ReservationList from "@client/components/ReservationList";

const ReservationsPage = () => {
  const { data, error, isPending } = useService();

  return (
    <ControllerLayout isPending={isPending} error={error}>
      <Stack
        direction="column"
        sx={{
          width: "99dvw",
          height: "81dvh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            width: "60dvw",
            height: "81dvh",
            p: 2,
          }}
        >
          <CardHeader sx={{ textAlign: "center" }} title="Reservations" />
          <ReservationList data={data} />
        </Card>
      </Stack>
    </ControllerLayout>
  );
};

export default ReservationsPage;
