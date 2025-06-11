import { Router } from "express";
import googleAuthRouter from "./google";
import sessionManager from "@server/SessionManager";

const authRouter = Router();

authRouter.get("/logout", (req, res) => {
  const { sessionId } = req.cookies as { sessionId: string | undefined };
  if (sessionId) {
    sessionManager.removeSession(sessionId);
    res.clearCookie("sessionId");
  }
  res.redirect("/");
});

authRouter.get("/session", (req, res) => {
  const { sessionId } = req.cookies as { sessionId: string | undefined };
  res.json(sessionId ? sessionManager.getSessionUser(sessionId) : null);
});

authRouter.use("/google", googleAuthRouter);

export default authRouter;
