import {
  mysqlTable,
  text,
  boolean,
  varchar,
  serial,
  primaryKey,
  bigint,
  timestamp,
  json,
  AnyMySqlColumn,
} from "drizzle-orm/mysql-core";

const commonFields = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().onUpdateNow().notNull(),
};

export const users = mysqlTable("users", {
  id: varchar({ length: 255 }).notNull().primaryKey(),
  displayName: text().notNull(),
  email: text().notNull(),
  picture: text().notNull(),
  ...commonFields,
});

export const resourcesGroups = mysqlTable("resource_groups", {
  id: serial().notNull().primaryKey(),
  ownerId: varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  ...commonFields,
});

export const resourcesAccess = mysqlTable(
  "resources_access",
  {
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    groupId: bigint({ mode: "bigint", unsigned: true })
      .notNull()
      .references(() => resourcesGroups.id),
    create: boolean().notNull().default(false),
    read: boolean().notNull().default(false),
    update: boolean().notNull().default(false),
    delete: boolean().notNull().default(false),
    manageAccess: boolean().notNull().default(false),
    reserveLevel: text({ enum: ["NONE", "REQUEST", "RESERVE", "APPROVE"] })
      .notNull()
      .default("NONE"),
    ...commonFields,
  },
  (table) => [primaryKey({ columns: [table.userId, table.groupId] })],
);

export const resourceType = mysqlTable("resource_type", {
  id: serial().primaryKey(),
  parentId: bigint({ mode: "bigint", unsigned: true }).references(
    (): AnyMySqlColumn => resourceType.id,
  ),
  groupId: bigint({ mode: "bigint", unsigned: true }).references(
    () => resourcesGroups.id,
  ),
  name: text().notNull(),
  shortName: text(),
  metadataSchema: json(),
  ...commonFields,
});

export const resource = mysqlTable("resource", {
  id: serial().primaryKey(),
  typeId: bigint({ mode: "bigint", unsigned: true })
    .references(() => resourceType.id)
    .notNull(),
  groupId: bigint({ mode: "bigint", unsigned: true })
    .references(() => resourcesGroups.id)
    .notNull(),
  label: varchar({ length: 255 }).unique(),
  metadata: json(),
  ...commonFields,
});

export const reservation = mysqlTable("reservation", {
  id: serial().primaryKey(),
  userId: varchar({ length: 255 })
    .references(() => users.id)
    .notNull(),
  startTime: timestamp().notNull(),
  endTime: timestamp().notNull(),
  reason: text(),
  status: text({ enum: ["REQUESTED", "CONFIRMED", "REJECTED", "CANCELED"] }),
  approvedBy: varchar({ length: 255 }).references(() => users.id),
  approvedAt: timestamp(),
  ...commonFields,
});

export const resourceToReservation = mysqlTable(
  "resource_to_reservation",
  {
    resourceId: bigint({ mode: "bigint", unsigned: true })
      .references(() => resource.id)
      .notNull(),
    reservationId: bigint({ mode: "bigint", unsigned: true })
      .references(() => reservation.id)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.resourceId, table.reservationId] })],
);

export const session = mysqlTable("session", {
  id: varchar({ length: 255 }).primaryKey(),
  userId: varchar({ length: 255 })
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp().notNull(),
  isActive: boolean().notNull().default(true),
  ip: text(),
  userAgent: text(),
  ...commonFields,
});
