import { getSupabaseServerClient } from "@/lib/supabase-server"
import { MobileMenu } from "@/components/mobile-menu"

export default async function MenuPage() {
  const supabase = await getSupabaseServerClient()

  // Load display settings
  const { data: settings } = await supabase.from("display_settings").select("*")

  const backgroundColor = settings?.find((s) => s.setting_key === "background_color")?.setting_value || "#ffffff"
  const accentColor = settings?.find((s) => s.setting_key === "accent_color")?.setting_value || "#ef4444"

  // Load categories with products
  const { data: categories } = await supabase.from("categories").select("*").order("display_order")

  const categoriesWithProducts = await Promise.all(
    (categories || []).map(async (category) => {
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", category.id)
        .eq("is_active", true)
        .order("name")

      return {
        ...category,
        products: products || [],
      }
    }),
  )

  return <MobileMenu categories={categoriesWithProducts} backgroundColor={backgroundColor} accentColor={accentColor} />
}
