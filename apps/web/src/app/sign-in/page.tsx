"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { signInWithEmail } from "@/lib/auth-client"

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  async function submit(formData: FormData) {
    setPending(true)
    setError(null)
    const message = await signInWithEmail(
      String(formData.get("email")),
      String(formData.get("password"))
    )
    setPending(false)
    if (message) setError(message)
  }
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-bold">Administrator sign in</h1>
      <form action={submit} className="mt-6 grid gap-4">
        <label>
          Email
          <Input
            className="mt-1"
            name="email"
            type="email"
            required
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <Input
            className="mt-1"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
        <Button variant="outline" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
        {error && <p role="alert">{error}</p>}
      </form>
    </main>
  )
}
