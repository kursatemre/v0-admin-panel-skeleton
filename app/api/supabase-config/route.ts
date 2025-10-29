import { NextResponse } from "next/server"
import { getSupabaseConfig } from "@/lib/supabase-config"

export async function GET() {
  try {
    const config = await getSupabaseConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error("Error getting Supabase config:", error)
    return NextResponse.json({ error: "Failed to get Supabase configuration" }, { status: 500 })
  }
}
