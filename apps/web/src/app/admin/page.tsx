import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@workspace/auth"
import { db } from "@workspace/database"
import { user } from "@workspace/database/schema"
import { eq } from "drizzle-orm"
export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")
  const [actor] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)
  if (actor?.role !== "admin") redirect("/")
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">Blog administration</h1>
      <p className="mt-4">
        Administrator workspace. Draft editing and publishing UI are not
        implemented yet.
      </p>
    </main>
  )
}
