"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ConsentPage() {
  const params = useSearchParams();
  const clientId = params.get("client_id") ?? "";
  const scopes = useMemo(() => (params.get("scope") ?? "").split(/\s+/).filter(Boolean), [params]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  async function decide(accept: boolean) {
    setPending(true); setError(null);
    const result = await authClient.oauth2.consent({ accept });
    setPending(false);
    if (result.error) setError(result.error.message ?? "Unable to process consent.");
  }
  return <main className="mx-auto max-w-xl p-8"><h1 className="text-2xl font-bold">Authorize MCP client</h1><p className="mt-4">Client: {clientId || "Unknown client"}</p><h2 className="mt-6 font-semibold">Requested access</h2>{scopes.length ? <ul className="list-disc pl-6">{scopes.map(scope => <li key={scope}>{scope}</li>)}</ul> : <p>No scopes requested.</p>}<div className="mt-6 flex gap-3"><button className="border px-4 py-2" disabled={pending} onClick={() => void decide(true)}>Approve</button><button className="border px-4 py-2" disabled={pending} onClick={() => void decide(false)}>Deny</button></div>{error && <p className="mt-4" role="alert">{error}</p>}</main>;
}
