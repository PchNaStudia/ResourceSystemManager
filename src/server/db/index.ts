import env from "@server/env";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import {
  usersTable,
  resourcesAccessTable,
  resourcesGroupsTable,
} from "./schema";
export * from "./schema";

const client = createClient({ url: env.DB_FILE_NAME });
const db = drizzle({
  schema: {
    usersTable,
    resourcesAccessTable,
    resourcesGroupsTable,
  },
  client,
});

export default db;
