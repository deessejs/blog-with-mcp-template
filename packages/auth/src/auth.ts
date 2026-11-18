import { betterAuth, type Auth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { mcp } from "@better-auth/mcp";
import { admin, jwt } from "better-auth/plugins";
import { db } from "@workspace/database";
import * as schema from "@workspace/database";
import { serverEnv } from "@workspace/env/server";

const authInternal = betterAuth({
  baseURL: serverEnv.BETTER_AUTH_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  trustedOrigins: [...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []), ...serverEnv.ALLOWED_ORIGINS],
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true, disableSignUp: true },
  plugins: [nextCookies(), admin(), jwt({ disableSettingJwtHeader: true }), mcp({ loginPage: "/sign-in", consentPage: "/consent", resource: `${serverEnv.BETTER_AUTH_URL}/api/mcp` })],
});

// Keep the fully inferred plugin graph private: declaration emit otherwise serializes
// OAuth provider internals. The runtime remains the configured Better Auth instance.
export const auth: Auth<BetterAuthOptions> = authInternal as unknown as Auth<BetterAuthOptions>;

export async function getAuthSecret(): Promise<string> {
  return (await authInternal.$context).secret;
}

export async function getPublicOAuthClient(clientId: string, headers: Headers): Promise<{ client_name: string | null | undefined }> {
  const client = await authInternal.api.getOAuthClientPublic({ query: { client_id: clientId }, headers });
  return { client_name: client.client_name };
}

export type AuthInstance = Auth<BetterAuthOptions>;
export type { Session, User } from "better-auth";
