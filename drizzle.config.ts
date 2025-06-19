import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import env from "./src/server/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    database: env.DATABASE_NAME,
    password: env.DATABASE_PASSWORD,
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
  },
});
