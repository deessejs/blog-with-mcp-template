import { db } from "@workspace/database";
import { article } from "@workspace/database/schema";
import { desc, isNotNull } from "drizzle-orm";
export const metadata = { title: "Blog", description: "Published articles" };
export default async function Page() {
 const posts = await db.select({ slug: article.slug, title: article.publishedTitle, markdown: article.publishedMarkdown, publishedAt: article.publishedAt }).from(article).where(isNotNull(article.publishedAt)).orderBy(desc(article.publishedAt));
 return <main className="mx-auto max-w-3xl p-8"><h1 className="text-3xl font-bold">Blog</h1>{posts.length === 0 ? <p className="mt-4">No published articles yet.</p> : posts.map(post => <article key={post.slug} className="my-8"><h2 className="text-2xl font-semibold">{post.title}</h2><pre className="mt-3 whitespace-pre-wrap font-sans">{post.markdown}</pre></article>)}</main>;
}
