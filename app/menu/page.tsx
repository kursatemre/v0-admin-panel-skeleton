import { getSupabaseServerClient } from "@/lib/supabase-server"
import { MobileMenu } from "@/components/mobile-menu"

export default async function MenuPage() {
  const supabase = await getSupabaseServerClient()

  const { data: settings } = await supabase.from("display_settings").select("*")

  const backgroundColor = settings?.find((s) => s.setting_key === "background_color")?.setting_value || "#ffffff"
  const accentColor = settings?.find((s) => s.setting_key === "accent_color")?.setting_value || "#ef4444"
  const pageBgColor = settings?.find((s) => s.setting_key === "page_bg_color")?.setting_value || "#f9fafb"
  const contentAreaBgColor =
    settings?.find((s) => s.setting_key === "content_area_bg_color")?.setting_value || "#ffffff"
  const headerBgColor = settings?.find((s) => s.setting_key === "header_bg_color")?.setting_value || "#1f2937"
  const headerTextColor = settings?.find((s) => s.setting_key === "header_text_color")?.setting_value || "#ffffff"
  const categoryBgColor = settings?.find((s) => s.setting_key === "category_bg_color")?.setting_value || "#f3f4f6"
  const categoryTextColor = settings?.find((s) => s.setting_key === "category_text_color")?.setting_value || "#111827"
  const productBgColor = settings?.find((s) => s.setting_key === "product_bg_color")?.setting_value || "#ffffff"
  const productNameColor = settings?.find((s) => s.setting_key === "product_name_color")?.setting_value || "#111827"
  const productDescColor = settings?.find((s) => s.setting_key === "product_desc_color")?.setting_value || "#6b7280"
  const priceColor = settings?.find((s) => s.setting_key === "price_color")?.setting_value || "#ef4444"
  const priceBgColor = settings?.find((s) => s.setting_key === "price_bg_color")?.setting_value || "#fef2f2"
  const backgroundPattern = settings?.find((s) => s.setting_key === "background_pattern")?.setting_value || "none"
  const fontSize = settings?.find((s) => s.setting_key === "font_size")?.setting_value || "medium"
  const borderRadius = settings?.find((s) => s.setting_key === "border_radius")?.setting_value || "medium"
  const logoSize = settings?.find((s) => s.setting_key === "logo_size")?.setting_value || "medium"
  const headerTitle = settings?.find((s) => s.setting_key === "header_title")?.setting_value || "Menümüz"
  const headerSubtitle =
    settings?.find((s) => s.setting_key === "header_subtitle")?.setting_value || "Lezzetli yemeklerimizi keşfedin"
  const headerLogoUrl = settings?.find((s) => s.setting_key === "header_logo_url")?.setting_value || ""
  const footerText = settings?.find((s) => s.setting_key === "footer_text")?.setting_value || "Afiyet olsun!"
  const footerLogoUrl = settings?.find((s) => s.setting_key === "footer_logo_url")?.setting_value || ""

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

  return (
    <MobileMenu
      categories={categoriesWithProducts}
      backgroundColor={backgroundColor}
      accentColor={accentColor}
      pageBgColor={pageBgColor}
      contentAreaBgColor={contentAreaBgColor}
      headerBgColor={headerBgColor}
      headerTextColor={headerTextColor}
      categoryBgColor={categoryBgColor}
      categoryTextColor={categoryTextColor}
      productBgColor={productBgColor}
      productNameColor={productNameColor}
      productDescColor={productDescColor}
      priceColor={priceColor}
      priceBgColor={priceBgColor}
      backgroundPattern={backgroundPattern}
      fontSize={fontSize}
      borderRadius={borderRadius}
      logoSize={logoSize}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
      headerLogoUrl={headerLogoUrl}
      footerText={footerText}
      footerLogoUrl={footerLogoUrl}
    />
  )
}
