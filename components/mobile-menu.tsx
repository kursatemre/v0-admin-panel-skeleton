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
  backgroundPattern: string
}

const getPatternStyle = (pattern: string, color: string) => {
  const opacity = "0.03"
  switch (pattern) {
    case "dots":
      return {
        backgroundImage: `radial-gradient(circle, ${color}${opacity} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }
    case "grid":
      return {
        backgroundImage: `linear-gradient(${color}${opacity} 1px, transparent 1px), linear-gradient(90deg, ${color}${opacity} 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
      }
    case "diagonal":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${color}${opacity}, ${color}${opacity} 1px, transparent 1px, transparent 10px)`,
      }
    case "waves":
      return {
        backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${color}${opacity} 10px, transparent 20px)`,
      }
    default:
      return {}
  }
}

export function MobileMenu({ categories, backgroundColor, accentColor, backgroundPattern }: MobileMenuProps) {
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

  return (
    <div className="min-h-screen" style={{ backgroundColor, ...patternStyle }}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg border-b" style={{ backgroundColor: `${backgroundColor}f0` }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-balance">Menümüz</h1>
          <p className="text-center text-muted-foreground mt-2">Lezzetli yemeklerimizi keşfedin</p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              style={{ borderLeftWidth: "4px", borderLeftColor: accentColor }}
            >
              <div className="flex items-center gap-3">
                {category.image_url && (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={category.image_url || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h2 className="text-xl font-bold">{category.name}</h2>
                <span className="text-sm text-muted-foreground">({category.products.length})</span>
              </div>
              {expandedCategories.has(category.id) ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* Products List */}
            {expandedCategories.has(category.id) && (
              <div className="divide-y divide-border">
                {category.products.map((product) => (
                  <div key={product.id} className="p-6 hover:bg-accent/30 transition-colors">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {product.image_url && (
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
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
                            <h3 className="font-semibold text-lg mb-1 text-balance">{product.name}</h3>
                            {product.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                                {product.description}
                              </p>
                            )}
                          </div>
                          <div
                            className="font-bold text-lg whitespace-nowrap flex-shrink-0"
                            style={{ color: accentColor }}
                          >
                            {product.price.toFixed(2)} ₺
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {category.products.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground">Bu kategoride henüz ürün bulunmuyor</div>
                )}
              </div>
            )}
          </Card>
        ))}

        {categories.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Henüz kategori eklenmemiş</p>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>Afiyet olsun!</p>
      </div>
    </div>
  )
}
