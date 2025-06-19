import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import {
  users,
  session,
  reservation,
  resourceToReservation,
  resource,
  resourcesAccess,
  resourcesGroups,
  resourceType,
} from "./schema";

export const usersValidators = {
  create: createInsertSchema(users),
  read: createSelectSchema(users),
  update: createUpdateSchema(users),
};

export const sessionValidators = {
  create: createInsertSchema(session),
  read: createSelectSchema(session),
  update: createUpdateSchema(session),
};

export const reservationValidators = {
  create: createInsertSchema(reservation),
  read: createSelectSchema(reservation),
  update: createUpdateSchema(reservation),
};

export const resourceToReservationValidators = {
  create: createInsertSchema(resourceToReservation),
  read: createSelectSchema(resourceToReservation),
  update: createUpdateSchema(resourceToReservation),
};

export const resourceValidators = {
  create: createInsertSchema(resource),
  read: createSelectSchema(resource),
  update: createUpdateSchema(resource),
};

export const resourcesAccessValidators = {
  create: createInsertSchema(resourcesAccess),
  read: createSelectSchema(resourcesAccess),
  update: createUpdateSchema(resourcesAccess),
};

export const resourcesGroupsValidators = {
  create: createInsertSchema(resourcesGroups),
  read: createSelectSchema(resourcesGroups),
  update: createUpdateSchema(resourcesGroups),
};

export const resourceTypeValidators = {
  create: createInsertSchema(resourceType),
  read: createSelectSchema(resourceType),
  update: createUpdateSchema(resourceType),
};
