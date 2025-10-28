import { getSupabaseServerClient } from "@/lib/supabase-server"
import { TVDisplay } from "@/components/tv-display"

export default async function TVPage() {
  const supabase = await getSupabaseServerClient()

  const { data: settings } = await supabase.from("display_settings").select("*")

  const backgroundColor = settings?.find((s) => s.setting_key === "background_color")?.setting_value || "#1a1a1a"
  const accentColor = settings?.find((s) => s.setting_key === "accent_color")?.setting_value || "#ef4444"
  const backgroundPattern = settings?.find((s) => s.setting_key === "background_pattern")?.setting_value || "none"

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
        id: category.id,
        name: category.name,
        image_url: category.image_url,
        products: products || [],
      }
    }),
  )

  const nonEmptyCategories = categoriesWithProducts.filter((cat) => cat.products.length > 0)

  return (
    <TVDisplay
      categories={nonEmptyCategories}
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      backgroundPattern={backgroundPattern}
    />
  )
}
