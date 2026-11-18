export const dynamic = "force-dynamic";
import type { MetadataRoute } from "next";
import { db } from "@workspace/database";
import { article } from "@workspace/database/schema";
import { desc, isNotNull } from "drizzle-orm";
import { APP_URL } from "@workspace/ui/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${APP_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP_URL}/cookies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${APP_URL}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
  const published = await db.select({ slug: article.slug, publishedAt: article.publishedAt }).from(article).where(isNotNull(article.publishedAt)).orderBy(desc(article.publishedAt));
  return [...pages, ...published.map((post) => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))];
}
