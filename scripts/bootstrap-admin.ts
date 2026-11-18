import { spawnSync } from "node:child_process";
const args = process.argv.slice(2);
if (!args.includes("--email")) throw new Error("Usage: pnpm admin:bootstrap -- --email admin@example.com --name Admin [--password PASSWORD]");
const result = spawnSync("pnpm", ["--filter", "@workspace/auth", "exec", "auth", "create-admin", "--config", "./src/auth.ts", "--role", "admin", "--yes", ...args], { stdio: "inherit" });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
