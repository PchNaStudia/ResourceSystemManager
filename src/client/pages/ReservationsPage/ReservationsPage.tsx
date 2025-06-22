import React from "react";
import useService from "./ReservationsService";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardHeader,
  List,
  ListItem,
  Stack,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ControllerLayout from "@client/components/ControllerLayout";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const ReservationsPage = () => {
  const { data, error, isPending } = useService();

  return (
    <ControllerLayout isPending={isPending} error={error}>
      <Stack alignContent="center" justifyContent="center">
        <Card
          sx={{
            width: "fit-content",
            p: 2,
          }}
        >
          <CardHeader title="Reservations" />
          <List
            dense
            sx={{
              height: 400,
              overflowY: "auto",
              overflowX: "hidden",
              borderStyle: "solid",
              borderWidth: 1,
              width: "fit-content",
              borderRadius: 1,
            }}
          >
            {data.map(({ reservation, resources }) => {
              return (
                <ListItem key={reservation.id}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                      Reservation: {reservation.id}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        <DateTimeField
                          value={dayjs(reservation.startTime)}
                          label={"Start time"}
                        />
                        <DateTimeField
                          value={dayjs(reservation.endTime)}
                          label={"End time"}
                        />
                        <Accordion>
                          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                            Resources
                          </AccordionSummary>
                          <AccordionDetails>
                            <Stack spacing={2}>
                              {resources.map((resource) => (
                                <Stack key={resource.id} spacing={1}>
                                  {resource.label ?? resource.id}
                                </Stack>
                              ))}
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              );
            })}
          </List>
        </Card>
      </Stack>
    </ControllerLayout>
  );
};

export default ReservationsPage;
