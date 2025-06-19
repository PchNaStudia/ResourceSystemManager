import { Router } from "express";
import googleAuthRouter from "./auth";
import cookieParser from "cookie-parser";
import env from "@server/env";
import { uaMiddleware } from "@server/api/middlewares";
import resourcesGroupRouter from "src/server/api/resourcesGroup";

const apiRouter = Router();

apiRouter.use(cookieParser(env.SECRET));
apiRouter.use(uaMiddleware);

apiRouter.use('/auth', googleAuthRouter);
apiRouter.use('/resourcesGroup', resourcesGroupRouter)

export default apiRouter;
