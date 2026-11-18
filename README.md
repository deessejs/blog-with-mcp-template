# Blog with MCP

Single Next.js application in `apps/web`. PostgreSQL/Drizzle models published Markdown in `article` and one mutable draft per article in `article_draft`. The MCP endpoint at `/api/mcp` uses Better Auth MCP OAuth and administrator authorization. It lists and retrieves published content and retrieves or updates drafts; it has no publish operation.

## Setup

Use Node 22+ and pnpm 11. Set `DATABASE_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET`. Apply migrations using `pnpm db:migrate`. Provision the initial administrator using Better Auth's official CLI through `pnpm admin:bootstrap -- --email admin@example.com --name Admin`; provide `--password` or enter the CLI prompt. The command creates an email-verified administrator without sending confirmation email. Runtime password signup is enabled for login but `disableSignUp` prevents public registration.

Public database article rendering and admin editing/publishing UI remain outside this foundation; the admin page is a placeholder.
