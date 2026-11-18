# Blog with MCP

This repository currently provides a single Next.js app in `apps/web`, a public homepage that reads published Markdown rows from PostgreSQL, and a session- and administrator-role-protected `/admin` placeholder. `/sign-in` provides password login; public signup is disabled. The admin area does not yet provide article editing or publishing controls.

The `/api/mcp` endpoint exposes published article listing and retrieval, draft retrieval, and a draft operation. Agents can create a new unpublished article by supplying a unique slug, title, and Markdown, or update an existing article's single editable draft by article ID. Published content is read only through MCP; there is no MCP publish operation.

## Setup

Use Node.js 22+ and pnpm 11. Set `DATABASE_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET`. Create the initial administrator with the Better Auth `create-admin` CLI (`--role admin --yes`); it marks the administrator email verified by default and does not send confirmation mail. Runtime password sign-in is enabled while public signup is disabled.

The checked-in migration history is not yet ready for clean database setup: Better Auth schema generation could not load the shared auth config because workspace package imports resolve to missing `packages/database/dist/index.js`. Do not treat the current migrations as complete until schema and migration generation succeeds against the aligned Better Auth packages.
