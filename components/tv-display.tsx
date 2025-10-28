"use client"

import { useEffect, useState } from "react"
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
  image_url: string | null
  products: Product[]
}

type TVDisplayProps = {
  categories: Category[]
  backgroundColor: string
  accentColor: string
  backgroundPattern: string
  fontSize: string
  borderRadius: string
}

const getPatternStyle = (pattern: string, color: string) => {
  switch (pattern) {
    case "dots":
      return {
        backgroundImage: `radial-gradient(circle, ${color}25 3px, transparent 3px)`,
        backgroundSize: "40px 40px",
      }
    case "grid":
      return {
        backgroundImage: `linear-gradient(${color}20 2px, transparent 2px), linear-gradient(90deg, ${color}20 2px, transparent 2px)`,
        backgroundSize: "50px 50px",
      }
    case "diagonal":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${color}15, ${color}15 3px, transparent 3px, transparent 20px)`,
      }
    case "waves":
      return {
        backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${color}15 20px, transparent 40px)`,
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
      return "0.75rem"
    case "large":
      return "2rem"
    default:
      return "1.5rem"
  }
}

export function TVDisplay({
  categories,
  backgroundColor,
  accentColor,
  backgroundPattern,
  fontSize,
  borderRadius,
}: TVDisplayProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev >= categories.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [categories.length])

  if (categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor }}>
        <p className="text-4xl text-muted-foreground">Henüz kategori eklenmemiş</p>
      </div>
    )
  }

  const currentCategory = categories[currentCategoryIndex]
  const patternStyle = getPatternStyle(backgroundPattern, accentColor)
  const fontMultiplier = getFontSizeMultiplier(fontSize)
  const radiusValue = getBorderRadiusValue(borderRadius)

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor, ...patternStyle }}>
      {/* Category Header with Image */}
      <div className="py-12 px-16 border-b-4" style={{ borderColor: accentColor }}>
        <div className="flex items-center justify-center gap-8">
          {currentCategory.image_url && (
            <div
              className="relative w-32 h-32 overflow-hidden border-4"
              style={{ borderColor: accentColor, borderRadius: radiusValue }}
            >
              <Image
                src={currentCategory.image_url || "/placeholder.svg"}
                alt={currentCategory.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1
              className="text-7xl font-bold text-balance"
              style={{ color: accentColor, fontSize: `${7 * fontMultiplier}rem` }}
            >
              {currentCategory.name}
            </h1>
            <p className="text-3xl text-muted-foreground mt-2" style={{ fontSize: `${3 * fontMultiplier}rem` }}>
              {currentCategory.products.length} Ürün
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid - Full Screen */}
      <div className="flex-1 p-16">
        <div className="grid grid-cols-3 gap-10 h-full">
          {currentCategory.products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="bg-card overflow-hidden shadow-2xl flex flex-col border-4"
              style={{ borderColor: `${accentColor}30`, borderRadius: radiusValue }}
            >
              {/* Product Image */}
              <div className="relative h-80 bg-muted">
                {product.image_url ? (
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-8xl">🍽️</div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 p-8 flex flex-col">
                <h3
                  className="text-4xl font-bold mb-4 text-balance leading-tight"
                  style={{ fontSize: `${4 * fontMultiplier}rem` }}
                >
                  {product.name}
                </h3>
                {product.description && (
                  <p
                    className="text-xl text-muted-foreground leading-relaxed mb-6 flex-1 text-pretty line-clamp-2"
                    style={{ fontSize: `${1.25 * fontMultiplier}rem` }}
                  >
                    {product.description}
                  </p>
                )}
                <div className="mt-auto">
                  <div
                    className="flex items-center justify-center gap-4 py-6 px-8"
                    style={{ backgroundColor: `${accentColor}15`, borderRadius: radiusValue }}
                  >
                    <span
                      className="text-5xl font-bold"
                      style={{ color: accentColor, fontSize: `${5 * fontMultiplier}rem` }}
                    >
                      {product.price.toFixed(2)} ₺
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Navigation Dots */}
      <div className="py-8 px-16">
        <div className="flex items-center justify-center gap-4">
          {categories.map((_, index) => (
            <div
              key={index}
              className="h-4 rounded-full transition-all duration-300"
              style={{
                width: index === currentCategoryIndex ? "64px" : "16px",
                backgroundColor: index === currentCategoryIndex ? accentColor : `${accentColor}40`,
              }}
            />
          ))}
        </div>
        <p className="text-center text-2xl text-muted-foreground mt-4" style={{ fontSize: `${2 * fontMultiplier}rem` }}>
          {currentCategoryIndex + 1} / {categories.length}
        </p>
      </div>
    </div>
  )
}
