# Blog with MCP

A single Next.js application in `apps/web` for a public blog and administrator workspace. Article bodies are Markdown stored in PostgreSQL; the published article and its editable draft are separate records so draft updates never change public content.

## Development

Use Node.js 22+ and pnpm 11. Copy `.env.example` to `.env` and configure `DATABASE_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET`. Install dependencies with `pnpm install`, apply database migrations with `pnpm db:migrate`, then start `pnpm --filter web dev`.

The Better Auth handler is mounted at `/api/auth`. Administrator provisioning and the protected remote MCP tools are part of the foundation; configure an administrator before connecting an MCP client. MCP tools are read-only for published content and may create/update drafts; publishing remains an administrator UI action.

## Architecture

- `apps/web`: public Next.js experience, admin route, Better Auth route, and remote MCP route.
- `packages/database`: Drizzle schema and migrations for Better Auth and published/draft article data.
- `packages/auth`: Better Auth configuration.

V1 intentionally excludes public sign-up, email verification, organizations, billing, and newsletters.
