import { Router } from "express";
import googleAuthRouter from "./google";
import { UserType } from "@common/DbTypesPolyfill";

const authRouter = Router();

authRouter.get("/logout", (_, res) => {
  res.clearCookie("sessionId");
  res.redirect("/");
});

authRouter.get("/session", (req, res) => {
  // TODO: Real implementation
  let user: UserType | null = null;
  const { sessionId } = req.cookies;
  if (sessionId) {
    user = { id: "1", FullName: "Name", email: "Name@gmail.com" };
  }
  res.json(user);
});

authRouter.use("/google", googleAuthRouter);

export default authRouter;
