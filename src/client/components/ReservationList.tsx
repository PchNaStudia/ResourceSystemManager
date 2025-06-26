import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  Stack,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";

type Reservation = {
  id: number;
  startTime: string | Date;
  endTime: string | Date;
};

type Resource = {
  id: number;
  label?: string | null;
};

type ReservationItem = {
  reservation: Reservation;
  resources: Resource[];
};

const ReservationList = ({ data }: { data: ReservationItem[] }) => {
  return (
    <List
      dense
      sx={{
        height: "fit-content",
        overflowY: "auto",
        overflowX: "hidden",
        borderStyle: "solid",
        borderWidth: 1,
        width: "fit-content",
        borderRadius: 1,
      }}
    >
      {data.map(({ reservation, resources }) => (
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
                  disabled
                />
                <DateTimeField
                  value={dayjs(reservation.endTime)}
                  label={"End time"}
                  disabled
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
      ))}
    </List>
  );
};

export default ReservationList;
