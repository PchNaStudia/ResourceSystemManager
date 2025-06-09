import express from "express";
import ViteExpress from "vite-express";
import env from "./env";
import apiRouter from "./api";

const app = express();

app.use("/api", apiRouter);

app.get("/", (_, res) => {
  res.redirect("/web");
});

ViteExpress.config({
  mode: env.NODE_ENV,
  ignorePaths: /\/api/,
});

ViteExpress.listen(app, env.PORT, () =>
  console.log(`Server running on port: ${env.PORT}`),
);
