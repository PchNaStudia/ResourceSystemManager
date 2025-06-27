import {
  CreateResourceSchema,
  GetReservationsSchema,
  ReservationApprovalEnum,
  ReservationApprovalSchema,
  ReserveSchema,
  ResourceAccessSchema,
  ResourceGroupAccessListSchema,
  ResourceGroupAccessSchema,
  ResourceSchemaList,
  ResourceTypeGetListSchema,
} from "@common/ApiTypes";
import { z } from "zod";

export const getUserGroups = async () => {
  const response = await fetch(`/api/resourcesGroup`);
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return ResourceGroupAccessListSchema.parse(await response.json());
};

export const getGroup = async (id: number) => {
  const response = await fetch(`/api/resourcesGroup/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return ResourceGroupAccessSchema.parse(await response.json());
};

export const getGroupReservations = async (id: number) => {
  const response = await fetch(`/api/resourcesGroup/${id}/reservations`);
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return GetReservationsSchema.parse(await response.json());
};

export const getGroupResources = async (id: number) => {
  const response = await fetch(`/api/resourcesGroup/${id}/resource`);
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return ResourceSchemaList.parse(await response.json());
};

export const getGroupTypes = async (id: number) => {
  const response = await fetch(`/api/resourcesGroup/${id}/types`);
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return ResourceTypeGetListSchema.parse(await response.json());
};

export const getGroupAccess = async (id: number) => {
  const response = await fetch(`/api/resourcesGroup/${id}/access`);
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return ResourceAccessSchema.parse(await response.json());
};

export const changeReservationStatus = async ({
  groupId,
  reservationId,
  status,
}: {
  groupId: number;
  reservationId: number;
  status: z.infer<typeof ReservationApprovalEnum>;
}) => {
  const response = await fetch(
    `/api/resourcesGroup/${groupId}/reservations/${reservationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        ReservationApprovalSchema.parse({
          status,
        }),
      ),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return;
};

export const createResource = async ({
  groupId,
  ...rest
}: z.infer<typeof CreateResourceSchema> & { groupId: number }) => {
  const response = await fetch(`/api/resourcesGroup/${groupId}/resource/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(CreateResourceSchema.parse(rest)),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return;
};

export const createReservation = async ({
  groupId,
  ...rest
}: z.infer<typeof ReserveSchema> & { groupId: number }) => {
  const response = await fetch(`/api/resourcesGroup/${groupId}/reservations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ReserveSchema.parse(rest)),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch groups: ${response.statusText}`);
  }
  return;
};
