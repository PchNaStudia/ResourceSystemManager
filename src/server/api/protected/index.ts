import { Router } from "express";
import authorize  from "./middleware";

const protectedRouter = Router();

protectedRouter.use(authorize);

protectedRouter.get("/profile", (req, res) => {
  if (!req.user) {
    res.status(500).json({ error: "User not attached to request" });
    return;
  }

  res.json({ message: "Hello protected route!", user: req.user });
});

export default protectedRouter;
