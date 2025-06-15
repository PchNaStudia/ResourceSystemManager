import { Router } from "express";
import authRouter from "./auth";
import cookieParser from "cookie-parser";
import env from "@server/env";
import protectedRouter from "./protected";

const apiRouter = Router();

apiRouter.use(cookieParser(env.SECRET));

apiRouter.use("/auth", authRouter);

apiRouter.use("/protected", protectedRouter);

export default apiRouter;
