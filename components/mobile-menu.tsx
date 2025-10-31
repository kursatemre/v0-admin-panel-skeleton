"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  order_enabled: boolean
}

type Category = {
  id: string
  name: string
  image_url?: string | null
  products: Product[]
}

type MobileMenuProps = {
  categories: Category[]
  backgroundColor: string
  accentColor: string
  pageBgColor: string
  contentAreaBgColor: string
  headerBgColor: string
  headerTextColor: string
  categoryBgColor: string
  categoryTextColor: string
  productBgColor: string
  productNameColor: string
  productDescColor: string
  priceColor: string
  priceBgColor: string
  backgroundPattern: string
  fontSize: string
  borderRadius: string
  logoSize: string
  headerTitle: string
  headerSubtitle: string
  headerLogoUrl: string
  footerText: string
  footerLogoUrl: string
}

const getPatternStyle = (pattern: string, color: string) => {
  switch (pattern) {
    case "dots":
      return {
        backgroundImage: `radial-gradient(circle, ${color}30 2px, transparent 2px)`,
        backgroundSize: "24px 24px",
      }
    case "grid":
      return {
        backgroundImage: `linear-gradient(${color}20 1.5px, transparent 1.5px), linear-gradient(90deg, ${color}20 1.5px, transparent 1.5px)`,
        backgroundSize: "30px 30px",
      }
    case "diagonal":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${color}15, ${color}15 2px, transparent 2px, transparent 12px)`,
      }
    case "waves":
      return {
        backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${color}15 15px, transparent 30px)`,
      }
    default:
      return {}
  }
}

const getFontSizeMultiplier = (size: string) => {
  switch (size) {
    case "small":
      return 0.9
    case "large":
      return 1.1
    case "xlarge":
      return 1.2
    default:
      return 1.0
  }
}

const getBorderRadiusValue = (radius: string) => {
  switch (radius) {
    case "none":
      return "0"
    case "small":
      return "0.375rem"
    case "large":
      return "1rem"
    default:
      return "0.5rem"
  }
}

const getLogoSizeValue = (size: string) => {
  switch (size) {
    case "small":
      return "64px"
    case "large":
      return "128px"
    case "xlarge":
      return "160px"
    default:
      return "96px"
  }
}

export function MobileMenu({
  categories,
  backgroundColor,
  accentColor,
  pageBgColor,
  contentAreaBgColor,
  headerBgColor,
  headerTextColor,
  categoryBgColor,
  categoryTextColor,
  productBgColor,
  productNameColor,
  productDescColor,
  priceColor,
  priceBgColor,
  backgroundPattern,
  fontSize,
  borderRadius,
  logoSize,
  headerTitle,
  headerSubtitle,
  headerLogoUrl,
  footerText,
  footerLogoUrl,
}: MobileMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories.map((c) => c.id)))
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [orderForm, setOrderForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    quantity: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleOrder = async () => {
    if (!selectedProduct) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          ...orderForm,
        }),
      })

      if (!response.ok) throw new Error("Sipariş gönderilemedi")

      alert("Siparişiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.")
      setSelectedProduct(null)
      setOrderForm({
        first_name: "",
        last_name: "",
        phone: "",
        quantity: 1,
      })
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const patternStyle = getPatternStyle(backgroundPattern, accentColor)
  const fontMultiplier = getFontSizeMultiplier(fontSize)
  const radiusValue = getBorderRadiusValue(borderRadius)
  const logoSizeValue = getLogoSizeValue(logoSize)

  return (
    <div className="min-h-screen" style={{ backgroundColor: pageBgColor, ...patternStyle }}>
      <div className="sticky top-0 z-10 backdrop-blur-lg border-b" style={{ backgroundColor: headerBgColor }}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1
                className="text-3xl font-bold text-balance"
                style={{ fontSize: `${3 * fontMultiplier}rem`, color: headerTextColor }}
              >
                {headerTitle}
              </h1>
              <p style={{ fontSize: `${1 * fontMultiplier}rem`, color: `${headerTextColor}cc` }}>{headerSubtitle}</p>
            </div>
            {headerLogoUrl && (
              <div
                className="relative overflow-hidden flex-shrink-0"
                style={{ width: logoSizeValue, height: logoSizeValue, borderRadius: radiusValue }}
              >
                <Image src={headerLogoUrl || "/placeholder.svg"} alt="Logo" fill className="object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6" style={{ backgroundColor: contentAreaBgColor }}>
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden" style={{ borderRadius: radiusValue }}>
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:opacity-90 transition-opacity"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: accentColor,
                backgroundColor: categoryBgColor,
                color: categoryTextColor,
              }}
            >
              <div className="flex items-center gap-3">
                {category.image_url && (
                  <div
                    className="relative w-10 h-10 overflow-hidden flex-shrink-0"
                    style={{ borderRadius: radiusValue }}
                  >
                    <Image
                      src={category.image_url || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h2 className="text-xl font-bold" style={{ fontSize: `${1.25 * fontMultiplier}rem` }}>
                  {category.name}
                </h2>
                <span className="text-sm opacity-70" style={{ fontSize: `${0.875 * fontMultiplier}rem` }}>
                  ({category.products.length})
                </span>
              </div>
              {expandedCategories.has(category.id) ? (
                <ChevronUp className="w-5 h-5 opacity-70" />
              ) : (
                <ChevronDown className="w-5 h-5 opacity-70" />
              )}
            </button>

            {/* Products List */}
            {expandedCategories.has(category.id) && (
              <div className="divide-y" style={{ borderColor: `${categoryTextColor}20` }}>
                {category.products.map((product) => (
                  <div
                    key={product.id}
                    className="p-6 hover:opacity-95 transition-opacity"
                    style={{ backgroundColor: productBgColor }}
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {product.image_url && (
                        <div
                          className="relative w-24 h-24 flex-shrink-0 overflow-hidden"
                          style={{ borderRadius: radiusValue, backgroundColor: `${productNameColor}10` }}
                        >
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3
                              className="font-semibold text-lg mb-1 text-balance"
                              style={{ fontSize: `${1.125 * fontMultiplier}rem`, color: productNameColor }}
                            >
                              {product.name}
                            </h3>
                            {product.description && (
                              <p
                                className="text-sm leading-relaxed text-pretty"
                                style={{ fontSize: `${0.875 * fontMultiplier}rem`, color: productDescColor }}
                              >
                                {product.description}
                              </p>
                            )}
                          </div>
                          <div
                            className="font-bold text-lg whitespace-nowrap flex-shrink-0 px-3 py-1 rounded"
                            style={{
                              color: priceColor,
                              backgroundColor: priceBgColor,
                              fontSize: `${1.125 * fontMultiplier}rem`,
                              borderRadius: radiusValue,
                            }}
                          >
                            {product.price.toFixed(2)} ₺
                          </div>
                        </div>
                        {product.order_enabled && (
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="mt-3 px-4 py-2 rounded font-medium text-sm transition-opacity hover:opacity-90"
                            style={{
                              backgroundColor: accentColor,
                              color: "#ffffff",
                              borderRadius: radiusValue,
                            }}
                          >
                            Sipariş Ver
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {category.products.length === 0 && (
                  <div
                    className="p-6 text-center"
                    style={{ fontSize: `${1 * fontMultiplier}rem`, color: productDescColor }}
                  >
                    Bu kategoride henüz ürün bulunmuyor
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}

        {categories.length === 0 && (
          <Card className="p-12 text-center" style={{ borderRadius: radiusValue }}>
            <p className="text-muted-foreground" style={{ fontSize: `${1 * fontMultiplier}rem` }}>
              Henüz kategori eklenmemiş
            </p>
          </Card>
        )}
      </div>

      <div
        className="max-w-4xl mx-auto px-4 py-8 text-center"
        style={{ fontSize: `${0.875 * fontMultiplier}rem`, color: productDescColor }}
      >
        {footerLogoUrl && (
          <div className="flex justify-center mb-4">
            <div
              className="relative overflow-hidden"
              style={{ width: logoSizeValue, height: logoSizeValue, borderRadius: radiusValue }}
            >
              <Image src={footerLogoUrl || "/placeholder.svg"} alt="Footer Logo" fill className="object-contain" />
            </div>
          </div>
        )}
        <p className="whitespace-pre-line">{footerText}</p>
      </div>

      {/* Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold" style={{ color: productNameColor }}>
                Sipariş Ver
              </h2>
              <p className="text-sm mt-1" style={{ color: productDescColor }}>
                {selectedProduct.name} - {selectedProduct.price.toFixed(2)} ₺
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Adınız *</label>
                <input
                  type="text"
                  value={orderForm.first_name}
                  onChange={(e) => setOrderForm({ ...orderForm, first_name: e.target.value })}
                  placeholder="Adınızı girin"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Soyadınız *</label>
                <input
                  type="text"
                  value={orderForm.last_name}
                  onChange={(e) => setOrderForm({ ...orderForm, last_name: e.target.value })}
                  placeholder="Soyadınızı girin"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telefon Numaranız *</label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Adet *</label>
                <input
                  type="number"
                  min="1"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: Number.parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm font-medium">
                  Toplam: {(selectedProduct.price * orderForm.quantity).toFixed(2)} ₺
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setSelectedProduct(null)}
                disabled={isSubmitting}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleOrder}
                disabled={isSubmitting || !orderForm.first_name || !orderForm.last_name || !orderForm.phone}
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: accentColor }}
              >
                {isSubmitting ? "Gönderiliyor..." : "Sipariş Ver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
