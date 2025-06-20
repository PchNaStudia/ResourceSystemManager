import { Router } from "express";
import { GetUserSchema, UpdateUserSchema } from "@common/ApiTypes";
import db, { users } from "@server/db";
import { z } from "zod";
import { eq } from "drizzle-orm";

const usersRouter = Router();

usersRouter.get("/", (req, res) => {
  try {
    res.json(GetUserSchema.parse(req.user!));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

usersRouter.get("/:id", async (req, res) => {
  try {
    const userId = z.string().parse(req.params.id);
    const user = (
      await db.select().from(users).where(eq(users.id, userId)).limit(1)
    )[0];
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(GetUserSchema.parse(user));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

usersRouter.put("/", async (req, res) => {
  try {
    const userUpdate = UpdateUserSchema.parse(req.body);
    const [result] = await db
      .update(users)
      .set(userUpdate)
      .where(eq(users.id, req.user!.id))
      .limit(1);
    if (result.affectedRows === 0) {
      res.status(500).json({ error: "You do not exist tf?" });
      return;
    }
    res.status(200).send();
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default usersRouter;
