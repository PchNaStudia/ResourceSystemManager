import { Router } from "express";
import googleAuthRouter from "./auth";
import cookieParser from "cookie-parser";
import env from "@server/env";
import { uaMiddleware } from "@server/api/middlewares";

const apiRouter = Router();

apiRouter.use(cookieParser(env.SECRET));
apiRouter.use(uaMiddleware);

apiRouter.use("/auth", googleAuthRouter);

export default apiRouter;
