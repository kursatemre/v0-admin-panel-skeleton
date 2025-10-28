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
  headerTitle,
  headerSubtitle,
  headerLogoUrl,
  footerText,
  footerLogoUrl,
}: MobileMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories.map((c) => c.id)))

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const patternStyle = getPatternStyle(backgroundPattern, accentColor)
  const fontMultiplier = getFontSizeMultiplier(fontSize)
  const radiusValue = getBorderRadiusValue(borderRadius)

  return (
    <div className="min-h-screen" style={{ backgroundColor: pageBgColor, ...patternStyle }}>
      <div className="sticky top-0 z-10 backdrop-blur-lg border-b" style={{ backgroundColor: headerBgColor }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-3">
            {headerLogoUrl && (
              <div className="relative w-20 h-20 overflow-hidden flex-shrink-0" style={{ borderRadius: radiusValue }}>
                <Image src={headerLogoUrl || "/placeholder.svg"} alt="Logo" fill className="object-contain" />
              </div>
            )}
            <div className="text-center">
              <h1
                className="text-3xl font-bold text-balance"
                style={{ fontSize: `${3 * fontMultiplier}rem`, color: headerTextColor }}
              >
                {headerTitle}
              </h1>
              <p className="mt-2" style={{ fontSize: `${1 * fontMultiplier}rem`, color: `${headerTextColor}cc` }}>
                {headerSubtitle}
              </p>
            </div>
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
            <div className="relative w-20 h-20 overflow-hidden" style={{ borderRadius: radiusValue }}>
              <Image src={footerLogoUrl || "/placeholder.svg"} alt="Footer Logo" fill className="object-contain" />
            </div>
          </div>
        )}
        <p className="whitespace-pre-line">{footerText}</p>
      </div>
    </div>
  )
}
