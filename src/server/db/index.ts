import env from "@server/env";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
export * from "./schema";

const client = createClient({ url: env.DB_FILE_NAME });
const db = drizzle({ schema, client });

export default db;
