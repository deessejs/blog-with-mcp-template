import { requireMcpAuth } from "@better-auth/mcp";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";
import { auth } from "@workspace/auth";
import { db } from "@workspace/database";
import { article, articleDraft, user } from "@workspace/database/schema";
import { and, desc, eq, isNotNull } from "drizzle-orm";

const resource = `${process.env.BETTER_AUTH_URL}/api/mcp`;
const handler = (actorId: string) => createMcpHandler(() => {
  const server = new McpServer({ name: "blog-mcp", version: "0.1.0" });
  server.registerTool("list_published_articles", { description: "List published blog articles", inputSchema: z.object({}) }, async () => {
    const rows = await db.select({ id: article.id, slug: article.slug, title: article.publishedTitle, publishedAt: article.publishedAt }).from(article).where(isNotNull(article.publishedAt)).orderBy(desc(article.publishedAt));
    return { content: [{ type: "text", text: JSON.stringify(rows) }] };
  });
  server.registerTool("get_published_article", { description: "Retrieve a published article by slug", inputSchema: z.object({ slug: z.string() }) }, async ({ slug }) => {
    const [row] = await db.select().from(article).where(and(eq(article.slug, slug), isNotNull(article.publishedAt))).limit(1);
    return { content: [{ type: "text", text: JSON.stringify(row ?? null) }] };
  });
  server.registerTool("get_article_draft", { description: "Retrieve the editable draft for an article", inputSchema: z.object({ articleId: z.string() }) }, async ({ articleId }) => {
    const [parent] = await db.select({ id: article.id }).from(article).where(eq(article.id, articleId)).limit(1);
    if (!parent) return { content: [{ type: "text", text: "Article not found" }], isError: true };
    const [row] = await db.select().from(articleDraft).where(eq(articleDraft.articleId, articleId)).limit(1);
    return { content: [{ type: "text", text: JSON.stringify(row ?? null) }] };
  });
  server.registerTool("update_article_draft", { description: "Create or update an article draft. This never publishes.", inputSchema: z.object({ articleId: z.string(), title: z.string(), markdown: z.string() }) }, async ({ articleId, title, markdown }) => {
    const [parent] = await db.select({ id: article.id }).from(article).where(eq(article.id, articleId)).limit(1);
    if (!parent) return { content: [{ type: "text", text: "Article not found" }], isError: true };
    const existing = await db.select({ id: articleDraft.id }).from(articleDraft).where(eq(articleDraft.articleId, articleId)).limit(1);
    const id = existing[0]?.id ?? crypto.randomUUID();
    await db.insert(articleDraft).values({ id, articleId, title, markdown, updatedBy: actorId }).onConflictDoUpdate({ target: articleDraft.articleId, set: { title, markdown, updatedAt: new Date() } });
    return { content: [{ type: "text", text: "Draft saved. It remains unpublished." }] };
  });
  return server;
}, { legacy: "reject" });

export const POST = requireMcpAuth(auth, async (request, claims) => {
  const actorId = typeof claims.sub === "string" ? claims.sub : undefined;
  if (!actorId) return new Response("Administrator identity required", { status: 403 });
  const [actor] = await db.select({ role: user.role }).from(user).where(eq(user.id, actorId)).limit(1);
  if (actor?.role !== "admin") return new Response("Administrator access required", { status: 403 });
  return handler(actorId).fetch(request);
}, { resource });
