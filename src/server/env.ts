import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

type NodeEnv = "development" | "production";

function isNodeEnv(env: string): env is NodeEnv {
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
});

const env = envSchema.parse(process.env);

export default env;
