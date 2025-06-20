import { Router } from "express";
import { z } from "zod";
import env from "@server/env";
import { createRemoteJWKSet, jwtVerify } from "jose";
import crypto from "crypto";
import {
  createSession,
  getUser,
  googleIdTokenPayloadSchema,
  logout,
} from "./helpers";
import { authMiddleware, noCacheMiddleware } from "@server/api/middlewares";
import { UserTypeSchema } from "@common/ApiTypes";

const googleConfigurationValidator = z
  .object({
    issuer: z.string().url(),
    authorization_endpoint: z.string().url(),
    token_endpoint: z.string().url(),
    userinfo_endpoint: z.string().url(),
    revocation_endpoint: z.string().url(),
    jwks_uri: z.string().url(),
  })
  .strip();

const googleAuthRouter = Router();

googleAuthRouter.use(noCacheMiddleware);

const knownOpenidConfiguration =
  "https://accounts.google.com/.well-known/openid-configuration";

const stateToNonce: Record<string, string> = {};

async function getGoogleWellKnown() {
  const res = await fetch(knownOpenidConfiguration);
  if (!res.ok) {
    throw new Error("Could not fetch google configuration");
  }
  return googleConfigurationValidator.parse(await res.json());
}

const googleConfiguration = await getGoogleWellKnown();
const jwks = createRemoteJWKSet(new URL(googleConfiguration.jwks_uri));

async function verifyGoogleIdToken(idToken: string) {
  try {
    const { payload } = await jwtVerify(idToken, jwks, {
      issuer: googleConfiguration.issuer,
      audience: env.GOOGLE_CLIENT_ID,
    });
    return googleIdTokenPayloadSchema.parse(payload);
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    return null;
  }
}

function renderClientSideRedirect(url: string) {
  return `<!DOCTYPE HTML>
<html lang="en-US">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0; url=${url}">
        <script type="text/javascript">
            window.location.href = "${url}"
        </script>
        <title>Page Redirection</title>
    </head>
    <body>
        If you are not redirected automatically, follow this <a href='${url}'>link to example</a>.
    </body>
</html>`;
}

googleAuthRouter.get("/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("base64url");
  const nonce = crypto.randomUUID().toString();
  stateToNonce[state] = nonce;
  const url = new URL(googleConfiguration.authorization_endpoint);
  const redirectUri = `${req.protocol}://${req.host}${req.baseUrl}/callback`;
  console.log(redirectUri);
  url.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("prompt", "select_account");
  res.redirect(url.toString());
});

const googleCallbackSchema = z
  .object({
    code: z.string().min(1),
    state: z.string().min(1),
  })
  .strip();

const googleTokenResponseSchema = z.object({
  access_token: z.string().min(1),
  id_token: z.string().min(1),
});

googleAuthRouter.get("/callback", async (req, res) => {
  const { code, state } = googleCallbackSchema.parse(req.query);
  if (!stateToNonce[state]) {
    res.status(400).json({ error: "Invalid state parameter" });
    return;
  }
  const nonce = stateToNonce[state];
  const tokenResponse = await fetch(googleConfiguration.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${req.protocol}://${req.host}${req.baseUrl}/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenResponse.ok) {
    console.error(await tokenResponse.json());
    res.status(500).json({ error: "Failed to exchange code for token" });
    return;
  }
  const { id_token } = googleTokenResponseSchema.parse(
    await tokenResponse.json(),
  );
  const payload = await verifyGoogleIdToken(id_token);
  if (!payload) {
    res.status(400).json({ error: "Invalid ID token" });
    return;
  }
  if (payload.nonce !== nonce) {
    res.status(400).json({ error: "Invalid nonce" });
    return;
  }
  if (!payload.email_verified) {
    res.status(400).json({ error: "Email not verified" });
    return;
  }
  const sessionId = await createSession(payload, req.ip, req.ua);
  res.cookie("sessionId", sessionId, {
    sameSite: "lax",
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    signed: true,
  });
  res.set("Content-Type", "text/html");
  res.send(
    Buffer.from(renderClientSideRedirect(`${req.baseUrl}/upgrade`), "utf-8"),
  );
});

googleAuthRouter.get("/upgrade", async (req, res) => {
  const { sessionId } = req.signedCookies as { sessionId?: string };
  if (!sessionId || !(await getUser(sessionId))) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.cookie("sessionId", sessionId, {
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    signed: true,
  });
  res.redirect("/web");
});

googleAuthRouter.get("/session", async (req, res) => {
  try {
    const { sessionId } = req.signedCookies as { sessionId?: string };
    if (!sessionId) {
      res.json(null);
      return;
    }
    res.json(UserTypeSchema.parse(await getUser(sessionId)));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

googleAuthRouter.get("/logout", authMiddleware, async (req, res) => {
  await logout(req.session!.id);
  res.clearCookie("sessionId");
  res.status(200);
  res.redirect(env.BASE);
});

export default googleAuthRouter;
