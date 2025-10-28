import { getSupabaseServerClient } from "@/lib/supabase-server"
import { TVDisplay } from "@/components/tv-display"

export default async function TVPage() {
  const supabase = await getSupabaseServerClient()

  // Load display settings
  const { data: settings } = await supabase.from("display_settings").select("*")

  const backgroundColor = settings?.find((s) => s.setting_key === "background_color")?.setting_value || "#1a1a1a"
  const accentColor = settings?.find((s) => s.setting_key === "accent_color")?.setting_value || "#ef4444"

  // Load all active products with categories
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        name
      )
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  const productsWithCategory = (products || []).map((p: any) => ({
    ...p,
    category_name: p.categories?.name || "Diğer",
  }))

  return <TVDisplay products={productsWithCategory} backgroundColor={backgroundColor} accentColor={accentColor} />
}
