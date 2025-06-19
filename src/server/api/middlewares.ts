import { Request, Response, NextFunction } from "express";
import { getSession } from "@server/api/auth/helpers";
import env from "@server/env";

export const uaMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.ua = req.get("User-Agent");
  next();
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { sessionId } = req.signedCookies as { sessionId?: string };
  if (!sessionId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const session = await getSession(sessionId);
  if (!session) {
    res.clearCookie("sessionId");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.user = session.users;
  req.session = session.session;
  res.cookie("sessionId", sessionId, {
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    signed: true,
  });
  next();
};

export const noCacheMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Surrogate-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};
