import { users, session, resourcesAccess, resourcesGroups } from "@server/db/schema";

declare global {
  namespace Express {
    interface Request {
      user?: typeof users.$inferSelect;
      session?: typeof session.$inferSelect;
      ua?: string;
      resourceAccess?: typeof resourcesAccess.$inferSelect | null;
      resourceGroup?: typeof resourcesGroups.$inferSelect;
    }
  }
}
