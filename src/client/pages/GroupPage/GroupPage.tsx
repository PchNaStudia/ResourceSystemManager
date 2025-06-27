import React from "react";
import ControllerLayout from "@client/components/ControllerLayout";
import {
  Card,
  CardContent,
  Tabs,
  Typography,
  Tab,
  Stack,
  CardHeader,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  TextField,
  MenuItem,
  InputLabel,
  Paper,
} from "@mui/material";
import useService from "./GroupService";
import { useAuth } from "@client/AuthContext";
import { z, ZodError } from "zod";
import {
  CreateResourceSchema,
  GetReservationsSchema,
  ReserveSchema,
  ResourceSchemaList,
  ResourceTypeGetListSchema,
} from "@common/ApiTypes";
import ReservationList from "@client/components/ReservationList";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

type ResourceGroupPageProps = {
  id: number;
};

const ResourceGroupPage = ({ id }: ResourceGroupPageProps) => {
  const {
    data: { group, resources, access, reservations, types },
    error,
    isPending,
    cancelReservation,
    createResource,
    createReservation,
  } = useService(id);
  const { user } = useAuth();

  const [tab, setTab] = React.useState<
    | "resources"
    | "reservations"
    | "types"
    | "manageReservations"
    | "manageGroup"
  >("resources");
  const isOwner = React.useMemo(
    () => group.ownerId === user?.id,
    [group, user],
  );

  return (
    <ControllerLayout isPending={isPending} error={error}>
      <Stack spacing={2} direction="column" sx={{ width: "100%" }}>
        <Tabs value={tab}>
          <Tab
            label="Resources"
            value="resources"
            onClick={() => setTab("resources")}
          />
          <Tab
            label="Your reservations"
            value="reservations"
            onClick={() => setTab("reservations")}
          />
          <Tab label="Types" value="types" onClick={() => setTab("types")} />
          {(isOwner || access!.reserveLevel === "APPROVE") && (
            <Tab
              label="Manage Reservations"
              value="manageReservations"
              onClick={() => setTab("manageReservations")}
            />
          )}
          {(isOwner || access!.manageAccess) && (
            <Tab
              label="Manage Group"
              value="manageGroup"
              onClick={() => setTab("manageGroup")}
            />
          )}
        </Tabs>
        <Stack px={2} width="100%">
          {tab === "resources" && (
            <ResourcesTab
              resources={resources}
              types={types}
              createResource={createResource}
            />
          )}
          {tab === "reservations" && (
            <ReservationsTab
              reservations={reservations}
              cancelCb={cancelReservation}
              resources={resources}
              createReservation={createReservation}
            />
          )}
          {tab === "types" && <TypesTab />}
          {(isOwner || access!.reserveLevel === "APPROVE") &&
            tab === "manageReservations" && <ManageReservationsTab />}
          {(isOwner || access!.manageAccess) && tab === "manageGroup" && (
            <ManageGroupTab />
          )}
        </Stack>
      </Stack>
    </ControllerLayout>
  );
};

type ResourcesTabTabProps = {
  resources: z.infer<typeof ResourceSchemaList>;
  types: z.infer<typeof ResourceTypeGetListSchema>;
  createResource: (data: z.infer<typeof CreateResourceSchema>) => void;
};

const ResourcesTab = ({
  resources,
  types,
  createResource,
}: ResourcesTabTabProps) => {
  const [openDialog, setOpenDialog] = React.useState<{
    label?: string;
    metadata?: string;
    typeId?: number;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCloseDialog = () => {
    setError(null);
    setOpenDialog(null);
  };

  return (
    <Stack>
      <Button variant="outlined" onClick={() => setOpenDialog({})}>
        Add resource
      </Button>
      <Grid spacing={2} pt={2} container>
        {resources.map((resource) => {
          return (
            <Card key={resource.id} sx={{ p: 2 }}>
              <CardHeader
                title={resource.label ?? resource.id.toString()}
                subheader={`Type: ${types.find((t) => t.id === resource.typeId)!.name}`}
              />
              <CardContent>
                <Typography variant="body2" component="pre">
                  Metadata:{" "}
                  {JSON.stringify(resource.metadata, null, 2) ?? "No metadata"}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Grid>
      {openDialog && (
        <Dialog open={!!openDialog} onClose={() => handleCloseDialog()}>
          <DialogTitle>Add resource</DialogTitle>
          <DialogContent>
            <Stack spacing={2} direction="column" sx={{ width: "100%" }}>
              <TextField
                label="Label"
                value={openDialog.label ?? ""}
                onChange={(e) => {
                  setOpenDialog((old) =>
                    old ? { ...old, label: e.target.value } : null,
                  );
                }}
              />
              <Select
                value={openDialog.typeId ?? ""}
                onChange={(e) => {
                  setOpenDialog((old) =>
                    old ? { ...old, typeId: e.target.value } : null,
                  );
                }}
              >
                {types.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Metadata"
                multiline
                rows={5}
                value={openDialog.metadata ?? ""}
                onChange={(e) => {
                  setOpenDialog((old) =>
                    old ? { ...old, metadata: e.target.value } : null,
                  );
                }}
              />
              {error && <Typography color="error">{error}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCloseDialog()}>Cancel</Button>
            <Button
              onClick={() => {
                if (!openDialog.typeId) {
                  setError("Type is required!");
                  return;
                }
                if (types.find((t) => t.id === openDialog.typeId)) {
                  createResource({
                    label:
                      openDialog.label === "" ? undefined : openDialog.label,
                    metadata:
                      openDialog.metadata === ""
                        ? undefined
                        : openDialog.metadata,
                    typeId: openDialog.typeId,
                  });
                  handleCloseDialog();
                }
                setError("Type not found");
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
};

type ReservationsTabProps = {
  reservations: z.infer<typeof GetReservationsSchema>;
  cancelCb: (id: number) => void;
  resources: z.infer<typeof ResourceSchemaList>;
  createReservation: (data: z.infer<typeof ReserveSchema>) => void;
};

const ReservationsTab = ({
  reservations,
  cancelCb,
  resources,
  createReservation,
}: ReservationsTabProps) => {
  const [newReservation, setNewReservation] = React.useState<
    z.infer<typeof ReserveSchema>
  >({
    startTime: new Date(),
    endTime: new Date(),
    force: false,
    resources: [],
    reason: null,
  });

  const [error, setError] = React.useState<string | null>(null);

  return (
    <Stack direction="row" justifyContent="space-around" sx={{ width: "100%" }}>
      <Stack width="40%">
        <ReservationList data={reservations} cancelCb={cancelCb} />
      </Stack>
      <Stack width="40%">
        <Paper
          sx={{
            p: 2,
          }}
        >
          <Stack spacing={2}>
            <Stack spacing={2} direction="row">
              <DateTimePicker
                value={dayjs(newReservation.startTime)}
                label="Start Time"
                sx={{ flex: 1 }}
                onChange={(e) => {
                  setNewReservation((old) => ({
                    ...old,
                    startTime: e!.toDate(),
                  }));
                }}
              />
              <DateTimePicker
                value={dayjs(newReservation.endTime)}
                label="End Time"
                sx={{ flex: 1 }}
                onChange={(e) => {
                  setNewReservation((old) => ({
                    ...old,
                    endTime: e!.toDate(),
                  }));
                }}
              />
            </Stack>
            <TextField
              label="Reason"
              value={newReservation.reason ?? ""}
              onChange={(e) => {
                setNewReservation((old) => ({
                  ...old,
                  reason: e.target.value,
                }));
              }}
            />
            <InputLabel>Resources</InputLabel>
            <Select
              label="Resources"
              multiple
              value={newReservation.resources}
              onChange={(e) => {
                setNewReservation((old) => ({
                  ...old,
                  resources:
                    typeof e.target.value === "string"
                      ? e.target.value.split(",").map((e) => parseInt(e))
                      : e.target.value,
                }));
              }}
            >
              {resources.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.label ?? r.id.toString()}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ pt: 2 }}
            spacing={2}
          >
            <Stack direction="row" justifyContent="start">
              {error && <Typography color="error">{error}</Typography>}
            </Stack>
            <Stack direction="row" justifyContent="end" spacing={2}>
              <Button
                variant="contained"
                onClick={() => {
                  setError(null);
                  setNewReservation({
                    startTime: new Date(),
                    endTime: new Date(),
                    force: false,
                    resources: [],
                    reason: null,
                  });
                }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  try {
                    createReservation(ReserveSchema.parse(newReservation));
                    setError(null);
                    setNewReservation({
                      startTime: new Date(),
                      endTime: new Date(),
                      force: false,
                      resources: [],
                      reason: null,
                    });
                  } catch (e) {
                    if (e instanceof ZodError)
                      setError(
                        Array.isArray(e.errors)
                          ? e.errors.map((e) => e.message).join(", ")
                          : e.message,
                      );
                    return;
                  }
                }}
              >
                Create
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
};

type TypesTabProps = /*TBD*/ object;

const TypesTab = ({}: TypesTabProps) => {
  return <Typography variant="h6">Types</Typography>;
};

type ManageReservationsTabProps = /*TBD*/ object;

const ManageReservationsTab = ({}: ManageReservationsTabProps) => {
  return <Typography variant="h6">Manage Reservations</Typography>;
};

type ManageGroupTabProps = /*TBD*/ object;

const ManageGroupTab = ({}: ManageGroupTabProps) => {
  return <Typography variant="h6">Manage Group</Typography>;
};

export default ResourceGroupPage;
