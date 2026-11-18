import { headers } from "next/headers";
import { auth } from "@workspace/auth";
import { verifyOAuthQueryParams } from "@better-auth/oauth-provider";
import { ConsentActions } from "./consent-actions";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default async function ConsentPage({ searchParams }: Props) {
 const params = await searchParams;
 const queryEntries = Object.entries(params).flatMap(([key, value]) => (Array.isArray(value) ? value.map(v => [key, v] as const) : typeof value === "string" ? [[key, value] as const] : []));
 const signedKeys = new Set(["sig", "ba_param", ...queryEntries.filter(([key]) => key === "ba_param").map(([, value]) => value)]);
 const signedQuery = new URLSearchParams(queryEntries.filter(([key]) => signedKeys.has(key))).toString();
 const { secret } = await auth.$context;
 if (!(await verifyOAuthQueryParams(signedQuery, secret))) return <main className="p-8"><h1 className="text-2xl font-bold">Invalid or expired authorization request</h1></main>;
 const query = new URLSearchParams(signedQuery); const clientId = query.get("client_id"); const redirectUri = query.get("redirect_uri");
 if (!clientId || !redirectUri) return <main className="p-8"><h1 className="text-2xl font-bold">Incomplete authorization request</h1></main>;
 const requestHeaders = await headers();
 const client = await auth.api.getOAuthClientPublic({ query: { client_id: clientId }, headers: requestHeaders });
 const redirectHost = new URL(redirectUri).host;
 let claims: string[] = []; try { const value = JSON.parse(query.get("claims") ?? "{}"); claims = Object.keys(value.userinfo ?? {}); } catch { claims = []; }
 return <main className="mx-auto max-w-xl p-8"><h1 className="text-2xl font-bold">Authorize MCP client</h1><ConsentActions clientName={client.client_name ?? clientId} redirectHost={redirectHost} scopes={(query.get("scope") ?? "").split(/\s+/).filter(Boolean)} claims={claims} /></main>;
}
