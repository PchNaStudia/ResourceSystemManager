import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { z } from "zod";
import { NoResourcesReservationSchema } from "@common/ApiTypes";

type Reservation = z.infer<typeof NoResourcesReservationSchema>;

type Resource = {
  id: number;
  label?: string | null;
};

type ReservationItem = {
  reservation: Reservation;
  resources: Resource[];
};

type ReservationListProps = {
  data: ReservationItem[];
  approveCb?: (id: number) => void;
  rejectCb?: (id: number) => void;
  cancelCb?: (id: number) => void;
};

const ReservationList = ({
  data,
  cancelCb,
  rejectCb,
  approveCb,
}: ReservationListProps) => {
  // Helper to handle icon clicks with reservation id
  const handleAction = (cb?: (id: number) => void, id?: number) => () => {
    if (cb && typeof id !== "undefined") cb(id);
  };

  return (
    <List
      dense
      sx={{
        width: "100%",
        maxWidth: 600,
        padding: 0,
      }}
    >
      {data.map(({ reservation, resources }) => (
        <Box key={reservation.id} sx={{ mb: 2 }}>
          <ListItem
            disableGutters
            // The divider gives subtle visual separation between items
            sx={{
              alignItems: "flex-start",
              padding: 0,
            }}
            secondaryAction={
              (cancelCb || rejectCb || approveCb) && (
                <Stack direction="row" spacing={1}>
                  {approveCb && reservation.status === "REQUESTED" && (
                    <IconButton
                      edge="end"
                      aria-label="approve"
                      onClick={handleAction(approveCb, reservation.id)}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                  )}
                  {rejectCb && reservation.status === "REQUESTED" && (
                    <IconButton
                      edge="end"
                      aria-label="reject"
                      onClick={handleAction(rejectCb, reservation.id)}
                    >
                      <ThumbDownIcon />
                    </IconButton>
                  )}
                  {cancelCb && (
                    <IconButton
                      edge="end"
                      aria-label="cancel"
                      onClick={handleAction(cancelCb, reservation.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>
              )
            }
          >
            <Accordion
              sx={{ width: "100%", boxShadow: 1, borderRadius: 1, pr: 5 }}
            >
              <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Reservation #{reservation.id}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <DateTimeField
                      value={dayjs(reservation.startTime)}
                      label="Start Time"
                      disabled
                      sx={{ flex: 1 }}
                    />
                    <DateTimeField
                      value={dayjs(reservation.endTime)}
                      label="End Time"
                      disabled
                      sx={{ flex: 1 }}
                    />
                  </Stack>

                  <Accordion sx={{ boxShadow: 0, mt: 1, borderRadius: 1 }}>
                    <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                      <Typography variant="body1" fontWeight="medium">
                        Resources
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1}>
                        {resources.length ? (
                          resources.map((resource) => (
                            <Typography key={resource.id} variant="body2">
                              {resource.label ?? `#${resource.id}`}
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No resources assigned
                          </Typography>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <Divider component="li" sx={{ mt: 2, mb: 0 }} />
        </Box>
      ))}
    </List>
  );
};

export default ReservationList;
