import { createAuthClient } from "better-auth/react"
import { oauthProviderClient } from "@better-auth/oauth-provider/client"

const authClient = createAuthClient({ plugins: [oauthProviderClient()] })

export async function signInWithEmail(
  email: string,
  password: string
): Promise<string | null> {
  const result = await authClient.signIn.email({ email, password })
  return result.error?.message ?? null
}

export async function decideOAuthConsent(
  accept: boolean
): Promise<string | null> {
  const result = await authClient.oauth2.consent({ accept })
  return result.error?.message ?? null
}
