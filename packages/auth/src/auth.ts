import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { mcp } from "@better-auth/mcp";
import { admin, jwt } from "better-auth/plugins";
import { db } from "@workspace/database";
import * as schema from "@workspace/database";
import { serverEnv } from "@workspace/env/server";

export const auth = betterAuth({
  baseURL: serverEnv.BETTER_AUTH_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  trustedOrigins: [...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []), ...serverEnv.ALLOWED_ORIGINS],
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true, disableSignUp: true },
  plugins: [nextCookies(), admin(), jwt({ disableSettingJwtHeader: true }), mcp({ resource: `${serverEnv.BETTER_AUTH_URL}/api/mcp` })],
});

export type AuthInstance = typeof auth;
export type { Session, User } from "better-auth";
