"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  async function submit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await authClient.signIn.email({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });
    setPending(false);
    if (result.error) setError(result.error.message ?? "Unable to sign in.");
  }
  return <main className="mx-auto max-w-md p-8"><h1 className="text-2xl font-bold">Administrator sign in</h1><form action={submit} className="mt-6 grid gap-4"><label>Email<input className="block w-full border p-2" name="email" type="email" required autoComplete="username" /></label><label>Password<input className="block w-full border p-2" name="password" type="password" required autoComplete="current-password" /></label><button className="border px-4 py-2" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>{error && <p role="alert">{error}</p>}</form></main>;
}
