import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getSupabaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
  }

  const postgresUrl = process.env.SUPABASE_POSTGRES_URL
  if (postgresUrl) {
    // Try multiple patterns to extract project reference
    const patterns = [
      // Pattern 1: postgres.[project-ref].supabase.co or .com
      /postgres\.([a-z0-9-]+)\.supabase\.(?:co|com)/,
      // Pattern 2: db.[project-ref].supabase.co or .com
      /db\.([a-z0-9-]+)\.supabase\.(?:co|com)/,
      // Pattern 3: @[project-ref].supabase.co or .com
      /@([a-z0-9-]+)\.supabase\.(?:co|com)/,
      // Pattern 4: aws-0-[region].pooler.supabase.com with project in connection string
      /\/\/postgres\.([a-z0-9-]+):/,
    ]

    for (const pattern of patterns) {
      const match = postgresUrl.match(pattern)
      if (match && match[1]) {
        const projectRef = match[1]
        const supabaseUrl = `https://${projectRef}.supabase.co`
        return supabaseUrl
      }
    }
  }

  throw new Error("Could not determine Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL environment variable.")
}

export async function getSupabaseServerClient() {
  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.")
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
