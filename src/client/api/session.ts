import { GetReservationsSchema } from "@common/ApiTypes";

export const getUserReservations = async () => {
  const response = await fetch("/api/session/reservations");
  if (!response.ok) {
    throw new Error(`Failed to fetch reservations: ${response.statusText}`);
  }
  return GetReservationsSchema.parse(await response.json());
};
