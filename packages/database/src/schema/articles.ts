import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const article = pgTable("article", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  publishedTitle: text("published_title"),
  publishedMarkdown: text("published_markdown"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("article_published_at_idx").on(table.publishedAt)]);

export const articleDraft = pgTable("article_draft", {
  id: text("id").primaryKey(),
  articleId: text("article_id").notNull().references(() => article.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  markdown: text("markdown").notNull(),
  updatedBy: text("updated_by").notNull().references(() => user.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("article_draft_article_id_idx").on(table.articleId)]);
