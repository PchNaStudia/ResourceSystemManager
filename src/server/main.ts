import express from "express";
import ViteExpress from "vite-express";
import env from "./env";
import apiRouter from "./api";
import cookieParser from "cookie-parser";

const isProd = process.env.NODE_ENV === "production";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser(env.SECRET));

app.use("/api", apiRouter);

if (env.BASE !== "/") {
  app.get("/", (_, res) => {
    res.redirect(env.BASE);
  });
}

ViteExpress.config({
  mode: env.NODE_ENV,
  ignorePaths: /\/api/,
  ...(isProd
    ? {}
    : {
        inlineViteConfig: {
          build: { outDir: "dist/client" },
          base: process.env.BASE,
        },
      }),
});

ViteExpress.listen(app, env.PORT, () =>
  console.log(`Server running on port: ${env.PORT}`),
);
