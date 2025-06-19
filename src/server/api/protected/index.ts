import { Router } from "express";
import authorize from "./middleware";

const protectedRouter = Router();

protectedRouter.use(authorize);

protectedRouter.get("/session", (req, res) => {
  if (!req.user) {
    console.error(
      "authorize middleware passed request without attaching req.user",
    );
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  res.json({ user: req.user });
});

export default protectedRouter;
