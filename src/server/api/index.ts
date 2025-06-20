import { Router } from "express";
import googleAuthRouter from "./auth";
import cookieParser from "cookie-parser";
import env from "@server/env";
import { uaMiddleware } from "@server/api/middlewares";
import resourcesGroupRouter from "src/server/api/resourcesGroup";
import usersRouter from "@server/api/users";

const apiRouter = Router();

apiRouter.use(cookieParser(env.SECRET));
apiRouter.use(uaMiddleware);

apiRouter.use("/auth", googleAuthRouter);
apiRouter.use("/resourcesGroup", resourcesGroupRouter);
apiRouter.use("/users", usersRouter);

export default apiRouter;
