"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type Props = { clientName: string; redirectHost: string; scopes: string[]; claims: string[] };
export function ConsentActions({ clientName, redirectHost, scopes, claims }: Props) {
 const [pending, setPending] = useState(false); const [error, setError] = useState<string | null>(null);
 async function decide(accept: boolean) { setPending(true); setError(null); const result = await authClient.oauth2.consent({ accept }); setPending(false); if (result.error) setError(result.error.message ?? "Unable to process consent."); }
 return <section><p>Client: {clientName}</p><p>Redirect host: {redirectHost}</p><h2 className="mt-6 font-semibold">Requested scopes</h2>{scopes.length ? <ul className="list-disc pl-6">{scopes.map(x => <li key={x}>{x}</li>)}</ul> : <p>No scopes requested.</p>}{claims.length > 0 && <><h2 className="mt-4 font-semibold">Requested profile claims</h2><ul className="list-disc pl-6">{claims.map(x => <li key={x}>{x}</li>)}</ul></>}<div className="mt-6 flex gap-3"><button className="border px-4 py-2" disabled={pending} onClick={() => void decide(true)}>Approve</button><button className="border px-4 py-2" disabled={pending} onClick={() => void decide(false)}>Deny</button></div>{error && <p className="mt-4" role="alert">{error}</p>}</section>;
}
