import { users, session } from "@server/db/schema";

declare global {
  namespace Express {
    interface Request {
      user?: typeof users.$inferSelect;
      session?: typeof session.$inferSelect;
      ua?: string;
    }
  }
}
