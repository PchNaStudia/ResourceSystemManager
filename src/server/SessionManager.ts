import db, { usersTable } from "./db";
import { z } from "zod";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const googleIdTokenPayloadSchema = z
  .object({
    sub: z.string().min(1),
    email: z.string().email(),
    email_verified: z.boolean(),
    at_hash: z.string().min(1),
    nonce: z.string().min(1),
    name: z.string().min(1),
    picture: z.string().url(),
  })
  .strip();

type GoogleIdTokenPayloadType = z.infer<typeof googleIdTokenPayloadSchema>;

export class SessionManager {
  #sessionMap = new Map<string, typeof usersTable.$inferSelect>();

  async tryCreateSession(payload: GoogleIdTokenPayloadType) {
    let user: typeof usersTable.$inferSelect | undefined = (
      await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, payload.sub))
        .limit(1)
    )[0];
    const userPayloadData = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };
    if (!user) {
      user = await this.#createUser(userPayloadData);
    } else if (
      user.email !== userPayloadData.email ||
      user.picture !== userPayloadData.picture ||
      user.name !== userPayloadData.name
    ) {
      user = (
        await db
          .update(usersTable)
          .set(userPayloadData)
          .where(eq(usersTable.id, payload.sub))
          .returning()
      )[0];
    }
    const sessionId = crypto.randomUUID().toString();
    this.#sessionMap.set(sessionId, user);
    return sessionId;
  }

  async #createUser(userData: typeof usersTable.$inferInsert) {
    return (await db.insert(usersTable).values(userData).returning())[0];
  }

  getSessionUser(sessionId: string) {
    return this.#sessionMap.get(sessionId) ?? null;
  }

  removeSession(sessionId: string) {
    this.#sessionMap.delete(sessionId);
  }
}

const sessionManager = new SessionManager();

export default sessionManager;
