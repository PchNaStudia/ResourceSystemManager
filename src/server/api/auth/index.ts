import { Router } from "express";
import googleAuthRouter from "./google";

const authRouter = Router();

authRouter.get("/logout", (_, res) => {
  res.clearCookie("sessionId");
  res.redirect("/");
});

authRouter.use("/google", googleAuthRouter);

export default authRouter;
