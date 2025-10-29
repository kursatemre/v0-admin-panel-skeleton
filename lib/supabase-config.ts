"use server"

// Server-side utility to extract Supabase URL from environment variables
export async function getSupabaseConfig() {
  // First check if NEXT_PUBLIC_SUPABASE_URL is set
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  }

  // Try to extract from SUPABASE_POSTGRES_URL
  const postgresUrl = process.env.SUPABASE_POSTGRES_URL

  if (!postgresUrl) {
    throw new Error("Could not find Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL environment variable.")
  }

  // Extract project reference from postgres URL
  // Format: postgresql://postgres.[project-ref]:[password]@...
  // Or: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

  let projectRef: string | null = null

  // Try pattern 1: postgres.[project-ref].supabase.co
  const match1 = postgresUrl.match(/postgres\.([a-z0-9]+)\.supabase\.co/)
  if (match1) {
    projectRef = match1[1]
  }

  // Try pattern 2: db.[project-ref].supabase.co
  if (!projectRef) {
    const match2 = postgresUrl.match(/db\.([a-z0-9]+)\.supabase\.co/)
    if (match2) {
      projectRef = match2[1]
    }
  }

  // Try pattern 3: aws-0-[region].pooler.supabase.com with project in user
  if (!projectRef) {
    const match3 = postgresUrl.match(/postgres\.([a-z0-9]+):/)
    if (match3) {
      projectRef = match3[1]
    }
  }

  if (!projectRef) {
    throw new Error(
      "Could not extract Supabase project reference from SUPABASE_POSTGRES_URL. Please set NEXT_PUBLIC_SUPABASE_URL environment variable.",
    )
  }

  const supabaseUrl = `https://${projectRef}.supabase.co`

  return {
    url: supabaseUrl,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }
}
