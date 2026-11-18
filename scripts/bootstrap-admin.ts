import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@workspace/database";
import * as schema from "@workspace/database";
import { serverEnv } from "@workspace/env/server";

const [name, email, password] = process.argv.slice(2);
if (!name || !email || !password) throw new Error("Usage: pnpm admin:bootstrap -- <name> <email> <password>");
const auth = betterAuth({ baseURL: serverEnv.BETTER_AUTH_URL, secret: serverEnv.BETTER_AUTH_SECRET, database: drizzleAdapter(db, { provider: "pg", schema }), emailAndPassword: { enabled: true } });
await auth.api.createUser({ body: { name, email, password, role: "admin" } });
console.log(`Administrator created: ${email}`);
