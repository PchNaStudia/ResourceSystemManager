import React from "react";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import dayjs from "dayjs";
import ReservationList from "@client/components/ReservationList";
import { z } from "zod";
import { GetReservationsSchema } from "@common/ApiTypes";

type CurrentReservationsWidgetProps = {
  data: z.infer<typeof GetReservationsSchema>;
};

const CurrentReservationsWidget = ({
  data,
}: CurrentReservationsWidgetProps) => {
  const today = dayjs();
  const filtered = data.filter(
    ({ reservation }) =>
      dayjs(reservation.startTime).isSame(today, "day") ||
      dayjs(reservation.startTime).isAfter(today, "day"),
  );

  return (
    <Box
      sx={{
        width: "40dvw",
        height: "80dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 1,
      }}
    >
      <Card
        sx={{
          width: "80dvw",
          height: "80dvh",
          p: 2,
        }}
      >
        <CardHeader align="center" title="Today & Upcoming Reservations" />
        {filtered.length === 0 ? (
          <Typography align="center">No upcoming reservations.</Typography>
        ) : (
          <ReservationList data={filtered} />
        )}
      </Card>
    </Box>
  );
};

export default CurrentReservationsWidget;
