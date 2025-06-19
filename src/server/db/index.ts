import env from "@server/env";
import { drizzle } from "drizzle-orm/mysql2";

import * as schema from "./schema";
export * from "./schema";

const db = drizzle({
  connection: {
    database: env.DATABASE_NAME,
    password: env.DATABASE_PASSWORD,
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
  },
  schema,
  mode: "default",
});

export default db;
