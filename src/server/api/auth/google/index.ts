import { Router } from "express";
import { z } from "zod";
import env from "../../../env";
import { createRemoteJWKSet, jwtVerify } from "jose";
import crypto from "crypto";

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
    return payload;
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

googleAuthRouter.get("/login", async (req, res) => {
  const state = crypto.randomBytes(16).toString("base64url");
  const nonce = crypto.randomUUID().toString();
  stateToNonce[state] = nonce;
  res.redirect(
    `${googleConfiguration.authorization_endpoint}?client_id=${env.GOOGLE_CLIENT_ID}&scope=openid%20email%20profile&response_type=code&redirect_uri=${req.protocol}://${req.host}${req.baseUrl}/callback&state=${state}&nonce=${nonce}`,
  );
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
  if (payload.email_verified !== true) {
    res.status(400).json({ error: "Email not verified" });
    return;
  }
  // TODO: Get user from database or create new one by 'sub' (subject) from payload
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = {
    id: 1,
    FullName: payload.name,
    email: payload.email,
    GoogleId: payload.sub,
  };
  // TODO: Create session in database or key value store (tbd)
  const sessionId = crypto.randomUUID().toString();
  res.cookie("sessionId", sessionId, {
    sameSite: "lax",
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
  });
  res.set("Content-Type", "text/html");
  res.send(
    Buffer.from(renderClientSideRedirect(`${req.baseUrl}/upgrade`), "utf-8"),
  );
});

googleAuthRouter.get("/upgrade", async (req, res) => {
  console.log(req.cookies);
  const { sessionId } = req.cookies;
  if (!sessionId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.cookie("sessionId", sessionId, {
    sameSite: "strict",
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
  });
  res.redirect("/web");
});

export default googleAuthRouter;
