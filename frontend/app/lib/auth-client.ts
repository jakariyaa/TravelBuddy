import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000/api/auth" // Absolute URL for SSR compatibility, proxied by Next.js
})

export const { signIn, signUp, signOut, useSession } = authClient;
