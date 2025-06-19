import { Request, Response, NextFunction } from "express";
import sessionManager from "@server/SessionManager";
import { UserType } from "@common/DbTypes";

interface SessionRequest extends Request {
  cookies: {
    sessionId?: string;
    [key: string]: unknown;
  };
  user?: UserType;
}

function authorize(req: SessionRequest, res: Response, next: NextFunction) {
  const { sessionId } = req.cookies;

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
