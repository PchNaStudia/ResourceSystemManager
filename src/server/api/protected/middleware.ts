import { Request, Response, NextFunction } from "express";
import sessionManager from "@server/SessionManager";

function authorize(req: Request, res: Response, next: NextFunction) {
  const { sessionId } = req.cookies as { sessionId?: string };

  if (!sessionId) {
    res.status(401).json({ error: "Unauthorized: No sessionId" });
    return;
  }

  const user = sessionManager.getSessionUser(sessionId);

  if (!user) {
    res.status(401).json({ error: "Unauthorized: Invalid session" });
    return;
  }

  req.user = user;
  next();
}
export default authorize;
