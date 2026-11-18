# Blog with MCP

This is a single Next.js app in `apps/web`. The public homepage reads published Markdown from PostgreSQL. `/sign-in` supports administrator password login, and `/admin` requires an authenticated session whose persisted Better Auth role is `admin`; its page is currently a placeholder without article editing or publishing controls.

The protected `/api/mcp` endpoint offers published article listing/retrieval, draft retrieval, and a draft create/update tool. The tool creates an unpublished article and its initial draft together, or updates the one draft associated with an existing article. MCP does not publish articles. OAuth consent UI is still a placeholder, so the full interactive OAuth authorization experience is not complete.

## Setup

Use Node.js 22+ and pnpm 11. Configure `DATABASE_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET`. The Better Auth plugin schema was generated from `packages/auth/src/auth.ts`; Drizzle migrations and metadata are checked in under `packages/database/drizzle`. Run `pnpm db:migrate` to apply them.

Create the first administrator with `pnpm admin:bootstrap -- --email admin@example.com --name Admin` and optionally `--password`. This invokes Better Auth CLI `1.7.25` `create-admin`; the CLI assigns role `admin`, marks the email verified by default, and sends no confirmation email. Runtime password login is enabled with public sign-up disabled.
