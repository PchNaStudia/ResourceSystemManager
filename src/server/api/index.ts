import { Router } from "express";
import authRouter from "./auth";
import cookieParser from "cookie-parser";
import env from "@server/env";

const apiRouter = Router();

apiRouter.use(cookieParser(env.SECRET));

apiRouter.use("/auth", authRouter);

export default apiRouter;
