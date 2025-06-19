// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server/main.ts"], // adjust if your entry is elsewhere
  outDir: "dist/server",
  format: ["esm"],
  target: "es2022",
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: false,
  dts: false, // set to true if you want .d.ts files
});
