import { Router } from "express";
import {
  ReserveSchema,
  GetReservationsSchema,
  ReservationApprovalSchema,
  GetReservationSchema,
  ReserveResponseSchema,
} from "@common/ApiTypes";
import db, { reservation, resource, resourceToReservation } from "@server/db";
import { and, eq, gt, gte, inArray, lt, lte, or, sql } from "drizzle-orm";
import { z } from "zod";

const reservationsRouter = Router();

type ReservationWithResources = {
  reservation: typeof reservation.$inferSelect;
  resources: (typeof resource.$inferSelect)[];
};

reservationsRouter.get("/", async (req, res) => {
  try {
    const all: Record<number, ReservationWithResources> = {};
    const canViewAll =
      !req.resourceAccess || req.resourceAccess.reserveLevel === "APPROVE";
    const reservations = await db
      .select({ reservation, resource })
      .from(reservation)
      .innerJoin(
        resourceToReservation,
        eq(reservation.id, resourceToReservation.reservationId),
      )
      .innerJoin(resource, eq(resourceToReservation.resourceId, resource.id))
      .where(
        canViewAll
          ? eq(reservation.groupId, req.resourceGroup!.id)
          : and(
              eq(reservation.groupId, req.resourceGroup!.id),
              eq(reservation.userId, req.user!.id),
            ),
      );
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

reservationsRouter.get("/:id", async (req, res) => {
  try {
    const reservationId = z.coerce.number().int().parse(req.params.id);
    const canViewAll =
      !req.resourceAccess || req.resourceAccess.reserveLevel === "APPROVE";
    const reservations = await db
      .select({ reservation, resource })
      .from(reservation)
      .innerJoin(
        resourceToReservation,
        eq(reservation.id, resourceToReservation.reservationId),
      )
      .innerJoin(resource, eq(resourceToReservation.resourceId, resource.id))
      .where(
        canViewAll
          ? and(
              eq(reservation.groupId, req.resourceGroup!.id),
              eq(reservation.id, reservationId),
            )
          : and(
              eq(reservation.groupId, req.resourceGroup!.id),
              eq(reservation.userId, req.user!.id),
              eq(reservation.id, reservationId),
            ),
      );
    if (reservations.length === 0) {
      res.status(404).json({
        error: "Reservation not found or you do not have permission to see it",
      });
      return;
    }
    const reserv: ReservationWithResources = {
      reservation: reservations[0].reservation,
      resources: [reservations[0].resource],
    };
    for (const res of reservations.slice(1)) {
      reserv.resources.push(res.resource);
    }
    res.json(GetReservationSchema.parse(Object.values(reserv)));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

reservationsRouter.put("/:id", async (req, res) => {
  try {
    const reservationId = z.coerce.number().int().parse(req.params.id);
    const { reserveLevel } = ReservationApprovalSchema.parse(req.body);
    if (reserveLevel === "CANCELED") {
      const [result] = await db
        .delete(reservation)
        .where(
          and(
            eq(reservation.userId, req.user!.id),
            eq(reservation.id, reservationId),
            eq(reservation.groupId, req.resourceGroup!.id),
          ),
        );
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Reservation not found" });
        return;
      }
      res.status(200).send();
      return;
    }
    if (req.resourceAccess && req.resourceAccess.reserveLevel !== "APPROVE") {
      res
        .status(401)
        .json({ error: "You do not have permission to approve reservations" });
      return;
    }
    const [result] = await db
      .update(reservation)
      .set({
        status: reserveLevel,
        approvedBy: req.user!.id,
        approvedAt: new Date(),
      })
      .where(
        and(
          eq(reservation.id, reservationId),
          eq(reservation.groupId, req.resourceGroup!.id),
        ),
      );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Reservation not found" });
      return;
    }
    res.status(200).send();
    return;
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

reservationsRouter.post("/", async (req, res) => {
  try {
    if (req.resourceAccess && req.resourceAccess.reserveLevel === "NONE") {
      res
        .status(401)
        .json({ error: "You do not have permission to reserve resources" });
      return;
    }
    const reserveData = ReserveSchema.parse(req.body);
    const id = await db.transaction(async (tx) => {
      await tx.execute(
        sql`SELECT * FROM ${resource} WHERE ${resource.id} IN (${reserveData.resources.join(", ")}) AND ${resource.groupId} = ${req.resourceGroup!.id} FOR UPDATE`,
      );
      const resources = await tx
        .select()
        .from(resource)
        .where(
          and(
            inArray(resource.id, reserveData.resources),
            eq(resource.groupId, req.resourceGroup!.id),
          ),
        );
      if (
        !reserveData.resources.every((v) => resources.some((r) => r.id === v))
      ) {
        res.status(400).json({
          error: "Some of the resources do not exist in resource group",
        });
        tx.rollback();
        return;
      }
      const conflicts = await tx
        .select({ status: reservation.status, id: reservation.id })
        .from(reservation)
        .innerJoin(
          resourceToReservation,
          eq(resourceToReservation.reservationId, reservation.id),
        )
        .where(
          and(
            inArray(resourceToReservation.resourceId, reserveData.resources),
            inArray(reservation.status, ["REQUESTED", "CONFIRMED"]),
            or(
              and(
                gt(reservation.endTime, reserveData.startTime),
                lte(reservation.startTime, reserveData.startTime),
              ),
              and(
                lt(reservation.startTime, reserveData.endTime),
                gte(reservation.endTime, reserveData.endTime),
              ),
              and(
                gte(reservation.startTime, reserveData.startTime),
                lte(reservation.endTime, reserveData.endTime),
              ),
            ),
          ),
        );
      if (conflicts.some((v) => v.status === "CONFIRMED")) {
        res.status(409).json({
          error: "Some of the resources are already reserved",
          hard: true,
        });
        tx.rollback();
        return;
      }
      let values: typeof reservation.$inferInsert = {
        groupId: req.resourceGroup!.id,
        startTime: reserveData.startTime,
        endTime: reserveData.endTime,
        status: "CONFIRMED",
        approvedAt: new Date(),
        userId: req.user!.id,
        approvedBy: req.user!.id,
      };
      if (conflicts.length > 0) {
        if (reserveData.force) {
          if (
            req.resourceAccess &&
            req.resourceAccess.reserveLevel !== "APPROVE"
          ) {
            // soft conflict without approval permissions
            values = {
              groupId: req.resourceGroup!.id,
              startTime: reserveData.startTime,
              endTime: reserveData.endTime,
              status: "REQUESTED",
              userId: req.user!.id,
            };
          } else {
            // confirmed reservation should reject all requested conflicting
            await tx
              .update(reservation)
              .set({
                status: "REJECTED",
                approvedBy: req.user!.id,
              })
              .where(
                inArray(
                  reservation.id,
                  conflicts.map((v) => v.id),
                ),
              );
          }
        } else {
          res.status(409).json({
            error: "Some of the resources are already requested",
            hard: false,
          });
          tx.rollback();
          return;
        }
      }
      const reservationId = (
        await tx.insert(reservation).values(values).$returningId()
      )[0];
      await tx.insert(resourceToReservation).values(
        reserveData.resources.map((v) => ({
          resourceId: v,
          reservationId: reservationId.id,
        })),
      );
      return reservationId;
    });
    res.status(201).json(ReserveResponseSchema.parse(id));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default reservationsRouter;
