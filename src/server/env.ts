import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

type NodeEnvType = "development" | "production";

function isNodeEnv(env: string): env is NodeEnvType {
  return env === "development" || env === "production";
}

const envSchema = z.object({
  NODE_ENV: z
    .string()
    .refine(isNodeEnv, "Invalid NODE_ENV")
    .default("development"),
  PORT: z.coerce
    .number()
    .int()
    .refine((port) => port > 0 && port < 65536, "Port number out of range")
    .default(3000),
  BASE: z
    .string()
    .refine((base) => base.startsWith("/"), "Invalid base pathname")
    .default("/web"),
  GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
  SECRET: z.string().min(1, "Secret is required"),
  DATABASE_NAME: z.string().min(1, "Database name is required"),
  DATABASE_PASSWORD: z.string().min(1, "Database password is required"),
  DATABASE_HOST: z.string().min(1, "Database host is required"),
  DATABASE_USER: z.string().min(1, "Database user is required"),
  DATABASE_PORT: z.coerce.number().int().default(3306),
});

const env = envSchema.parse(process.env);

export default env;
