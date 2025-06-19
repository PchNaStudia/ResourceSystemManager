import { z } from "zod";
import db, { session, users } from "@server/db";
import { and, eq, gte } from "drizzle-orm";
import crypto from "crypto";

const SESSION_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

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

export const createSession = async (
  payload: GoogleIdTokenPayloadType,
  ip?: string,
  userAgent?: string,
) => {
  await db
    .insert(users)
    .values({
      id: payload.sub,
      email: payload.email,
      picture: payload.picture,
      displayName: payload.name,
    })
    .onDuplicateKeyUpdate({
      set: {
        id: payload.sub,
      },
    });
  const id = crypto.randomUUID();
  await db.insert(session).values({
    userId: payload.sub,
    expiresAt: new Date(Date.now() + SESSION_EXPIRATION_TIME),
    ip,
    userAgent,
    id,
  });
  return id;
};

export const getSession = async (sessionId: string) => {
  return (
    await db
      .select()
      .from(users)
      .innerJoin(session, eq(users.id, session.userId))
      .where(
        and(
          eq(session.id, sessionId),
          eq(session.isActive, true),
          gte(session.expiresAt, new Date()),
        ),
      )
      .limit(1)
  )[0];
};

export const getUser = async (sessionId: string) => {
  return (await getSession(sessionId))?.users;
};

export const logout = async (sessionId: string) => {
  return db
    .update(session)
    .set({
      isActive: false,
    })
    .where(eq(session.id, sessionId));
};

export const removeOldSessions = async () => {
  return db
    .update(session)
    .set({
      isActive: false,
    })
    .where(gte(session.expiresAt, new Date()));
};
