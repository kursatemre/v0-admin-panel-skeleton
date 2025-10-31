"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Pencil, Trash2, X, Upload } from "lucide-react"
import { initSupabaseClient } from "@/lib/supabase-client" // Declare the variable before using it

type Product = {
  id: string
  name: string
  description: string
  category_id: string
  category_name?: string
  price: number
  image_url?: string
  is_active: boolean
  order_enabled: boolean
}

type Category = {
  id: string
  name: string
}

export function ProductManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: null as File | null,
    order_enabled: false,
  })
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    initSupabaseClient()
      .then((client) => {
        setSupabase(client)
      })
      .catch((error) => {
        console.error("[v0] Failed to initialize Supabase:", error)
      })
  }, [])

  useEffect(() => {
    if (supabase) {
      loadProducts()
      loadCategories()
    }
  }, [supabase])

  const loadProducts = async () => {
    if (!supabase) return

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error loading products:", error)
      return
    }

    const productsWithCategory = data.map((p: any) => ({
      ...p,
      category_name: p.categories?.name || "Kategori Yok",
    }))

    setProducts(productsWithCategory)
  }

  const loadCategories = async () => {
    if (!supabase) return

    const { data, error } = await supabase.from("categories").select("*").order("display_order")

    if (error) {
      console.error("[v0] Error loading categories:", error)
      return
    }

    setCategories(data || [])
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        category_id: product.category_id,
        image: null,
        order_enabled: product.order_enabled || false,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image: null,
        order_enabled: false,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      image: null,
      order_enabled: false,
    })
  }

  const handleSave = async () => {
    if (!supabase) return

    setIsLoading(true)
    try {
      let imageUrl = editingProduct?.image_url

      if (formData.image) {
        const formDataToSend = new FormData()
        formDataToSend.append("file", formData.image)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataToSend,
        })

        if (!uploadResponse.ok) {
          throw new Error("Görsel yüklenemedi")
        }

        const { url } = await uploadResponse.json()
        imageUrl = url
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category_id: formData.category_id || null,
        image_url: imageUrl,
        is_active: true,
        order_enabled: formData.order_enabled,
      }

      if (editingProduct) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id)

        if (error) {
          console.error("[v0] Error updating product:", error)
          throw error
        }
      } else {
        const { error } = await supabase.from("products").insert(productData)

        if (error) {
          console.error("[v0] Error inserting product:", error)
          throw error
        }
      }

      await loadProducts()
      handleCloseModal()
    } catch (error: any) {
      console.error("[v0] Error saving product:", error)
      alert(`Ürün kaydedilirken bir hata oluştu: ${error.message || JSON.stringify(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return

    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return

    const { error } = await supabase.from("products").update({ is_active: false }).eq("id", id)

    if (error) {
      console.error("[v0] Error deleting product:", error)
      alert("Ürün silinirken bir hata oluştu")
      return
    }

    await loadProducts()
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (!supabase) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Ürün Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Ürünlerinizi yönetin ve düzenleyin</p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Yeni Ürün Ekle
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ürün Adı</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Kategori</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fiyat</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{product.category_name}</td>
                  <td className="py-3 px-4 font-medium">{product.price.toFixed(2)} ₺</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleOpenModal(product)}>
                        <Pencil className="w-4 h-4" />
                        Düzenle
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Sil
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold">{editingProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ürün Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ürün adını girin"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ürün Açıklaması</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ürün açıklamasını girin"
                  rows={4}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ürün Fiyatı</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-4 pr-12 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₺</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori Seçimi</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ürün Görseli</label>
                <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-ring transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formData.image ? formData.image.name : "Görsel yüklemek için tıklayın"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border border-input rounded-lg">
                <input
                  type="checkbox"
                  id="order-enabled"
                  checked={formData.order_enabled}
                  onChange={(e) => setFormData({ ...formData, order_enabled: e.target.checked })}
                  className="w-4 h-4 rounded border-input"
                />
                <label htmlFor="order-enabled" className="text-sm font-medium cursor-pointer">
                  Sipariş alınabilir
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
                İptal
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
