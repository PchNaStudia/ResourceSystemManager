import { Router } from "express";
import db, { reservation, resource, resourceToReservation } from "@server/db";
import { eq } from "drizzle-orm";
import { GetReservationsSchema } from "@common/ApiTypes";

const sessionRouter = Router();

type ReservationWithResources = {
  reservation: typeof reservation.$inferSelect;
  resources: (typeof resource.$inferSelect)[];
};

sessionRouter.get("/reservations", async (req, res) => {
  try {
    const all: Record<number, ReservationWithResources> = {};
    const reservations = await db
      .select()
      .from(reservation)
      .innerJoin(
        resourceToReservation,
        eq(reservation.id, resourceToReservation.reservationId),
      )
      .innerJoin(resource, eq(resourceToReservation.resourceId, resource.id))
      .where(eq(reservation.userId, req.user!.id));
    for (const reservation of reservations) {
      if (!all[reservation.reservation.id]) {
        all[reservation.reservation.id] = {
          reservation: reservation.reservation,
          resources: [reservation.resource],
        };
      } else {
        all[reservation.reservation.id].resources.push(reservation.resource);
      }
    }
    res.json(GetReservationsSchema.parse(Object.values(all)));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default sessionRouter;
