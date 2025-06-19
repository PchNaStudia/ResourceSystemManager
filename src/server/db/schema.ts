import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const usersTable = sqliteTable("users_table", {
  id: text().notNull().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  picture: text().notNull(),
  createdAt: integer({ mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const resourcesGroupsTable = sqliteTable("resource_groups_table", {
  id: integer().notNull().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  searchable: integer({ mode: "boolean" }).notNull().default(false),
  ownerId: text()
    .notNull()
    .references(() => usersTable.id),
  createdAt: integer({ mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const resourcesAccessTable = sqliteTable(
  "resources_access_table",
  {
    userId: text()
      .notNull()
      .references(() => usersTable.id),
    groupId: integer()
      .notNull()
      .references(() => resourcesGroupsTable.id),
    create: integer({ mode: "boolean" }).notNull().default(false),
    read: integer({ mode: "boolean" }).notNull().default(false),
    update: integer({ mode: "boolean" }).notNull().default(false),
    delete: integer({ mode: "boolean" }).notNull().default(false),
    reserve: integer({ mode: "boolean" }).notNull().default(false),
    changePermissions: integer({ mode: "boolean" }).notNull().default(false),
    createdAt: integer({ mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [primaryKey({ columns: [table.userId, table.groupId] })],
);

export const validators = {
  select: {
    users: createSelectSchema(usersTable),
    resourcesGroups: createSelectSchema(resourcesGroupsTable),
    resourcesAccess: createSelectSchema(resourcesAccessTable),
  },
  update: {
    users: createUpdateSchema(usersTable),
    resourcesGroups: createUpdateSchema(resourcesGroupsTable),
    resourcesAccess: createUpdateSchema(resourcesAccessTable),
  },
  insert: {
    users: createInsertSchema(usersTable),
    resourcesGroups: createInsertSchema(resourcesGroupsTable),
    resourcesAccess: createInsertSchema(resourcesAccessTable),
  },
};
