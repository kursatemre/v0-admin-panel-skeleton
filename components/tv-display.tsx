"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_name: string
}

type TVDisplayProps = {
  products: Product[]
  backgroundColor: string
  accentColor: string
}

export function TVDisplay({ products, backgroundColor, accentColor }: TVDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 6

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.ceil(products.length / itemsPerPage) - 1
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 8000) // Change slide every 8 seconds

    return () => clearInterval(interval)
  }, [products.length])

  const currentProducts = products.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage)

  const totalPages = Math.ceil(products.length / itemsPerPage)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor }}>
      {/* Header */}
      <div className="py-8 px-12 border-b" style={{ borderColor: `${accentColor}40` }}>
        <h1 className="text-6xl font-bold text-center text-balance">Menümüz</h1>
        <p className="text-center text-2xl text-muted-foreground mt-3">Günün Lezzetleri</p>
      </div>

      {/* Products Grid */}
      <div className="flex-1 p-12">
        <div className="grid grid-cols-3 gap-8 h-full">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-2xl overflow-hidden shadow-lg flex flex-col border-2"
              style={{ borderColor: `${accentColor}20` }}
            >
              {/* Product Image */}
              <div className="relative h-64 bg-muted">
                {product.image_url ? (
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl text-muted-foreground">🍽️</div>
                  </div>
                )}
                {/* Category Badge */}
                <div
                  className="absolute top-4 left-4 px-4 py-2 rounded-full text-white font-semibold text-sm backdrop-blur-sm"
                  style={{ backgroundColor: `${accentColor}e0` }}
                >
                  {product.category_name}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 p-6 flex flex-col">
                <h3 className="text-3xl font-bold mb-3 text-balance leading-tight">{product.name}</h3>
                {product.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4 flex-1 text-pretty line-clamp-3">
                    {product.description}
                  </p>
                )}
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xl text-muted-foreground">Fiyat</span>
                    <span className="text-4xl font-bold" style={{ color: accentColor }}>
                      {product.price.toFixed(2)} ₺
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer with Pagination */}
      <div className="py-6 px-12 border-t" style={{ borderColor: `${accentColor}40` }}>
        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className="h-3 rounded-full transition-all"
              style={{
                width: index === currentIndex ? "48px" : "12px",
                backgroundColor: index === currentIndex ? accentColor : `${accentColor}40`,
              }}
            />
          ))}
        </div>
        <p className="text-center text-xl text-muted-foreground mt-4">
          {currentIndex + 1} / {totalPages}
        </p>
      </div>
    </div>
  )
}
