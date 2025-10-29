"use client"

import { createBrowserClient } from "@supabase/ssr"
export { initSupabaseClient }

let clientInstance: ReturnType<typeof createBrowserClient> | null = null
let initPromise: Promise<ReturnType<typeof createBrowserClient>> | null = null

async function fetchSupabaseConfig() {
  const response = await fetch("/api/supabase-config")
  if (!response.ok) {
    throw new Error("Failed to fetch Supabase configuration")
  }
  return response.json()
}

export function getSupabaseBrowserClient() {
  if (clientInstance) {
    return clientInstance
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    clientInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
    return clientInstance
  }

  throw new Error(
    "Supabase client requires async initialization. Use initSupabaseClient() in useEffect before accessing the client.",
  )
}

export async function initSupabaseClient() {
  if (clientInstance) {
    return clientInstance
  }

  if (initPromise) {
    return initPromise
  }

  initPromise = (async () => {
    try {
      // Try NEXT_PUBLIC env vars first
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        clientInstance = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        )
        return clientInstance
      }

      // Fetch config from API
      const config = await fetchSupabaseConfig()
      clientInstance = createBrowserClient(config.url, config.anonKey)
      return clientInstance
    } catch (error) {
      initPromise = null // Reset so it can be retried
      throw error
    }
  })()

  return initPromise
}
