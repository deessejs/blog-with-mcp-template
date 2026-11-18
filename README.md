# Blog with MCP

Single Next.js application in `apps/web`; PostgreSQL data is modeled in `packages/database` with Drizzle. `article` stores the immutable published Markdown fields and `article_draft` stores at most one editable draft per article. The MCP route is `/api/mcp`; Better Auth provides OAuth authorization and the protected resource using its official MCP plugin. MCP reads published articles and can retrieve/update drafts. It has no publishing operation.

## Setup

Use Node.js 22+ and pnpm 11. Configure `DATABASE_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET` in the environment. Apply schema with `pnpm db:migrate`. Create the first administrator directly using `pnpm admin:bootstrap -- "Admin Name" admin@example.com 'long-password'`. This command provisions the account with Better Auth's server API and does not require email confirmation. Public email/password signup is disabled.

The admin page is a foundation placeholder. Public DB-backed article rendering and article editing/publishing UI are not implemented yet.
