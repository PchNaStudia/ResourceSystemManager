import express from "express";
import ViteExpress from "vite-express";
import env from "./env";

const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

ViteExpress.config({
  mode: env.NODE_ENV,
  ignorePaths: /\/api/,
});

ViteExpress.listen(app, env.PORT, () =>
  console.log(`Server running on port: ${env.PORT}`),
);
