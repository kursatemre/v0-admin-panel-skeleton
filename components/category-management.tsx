"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FolderOpen, Pencil, Trash2, X, Upload } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import Image from "next/image"

type Category = {
  id: string
  name: string
  display_order: number
  image_url?: string | null
  product_count?: number
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: "", display_order: "", image_url: "" })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("display_order")

    if (error) {
      console.error("[v0] Error loading categories:", error)
      return
    }

    const categoriesWithCounts = await Promise.all(
      (data || []).map(async (cat) => {
        const { count } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("category_id", cat.id)
          .eq("is_active", true)

        return { ...cat, product_count: count || 0 }
      }),
    )

    setCategories(categoriesWithCounts)
  }

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        display_order: category.display_order.toString(),
        image_url: category.image_url || "",
      })
      setImagePreview(category.image_url || "")
    } else {
      setEditingCategory(null)
      setFormData({ name: "", display_order: (categories.length + 1).toString(), image_url: "" })
      setImagePreview("")
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData({ name: "", display_order: "", image_url: "" })
    setImageFile(null)
    setImagePreview("")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      let imageUrl = formData.image_url

      if (imageFile) {
        console.log("[v0] Uploading image:", imageFile.name)
        try {
          const formDataToSend = new FormData()
          formDataToSend.append("file", imageFile)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formDataToSend,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Upload failed")
          }

          const data = await response.json()
          imageUrl = data.url
          console.log("[v0] Image uploaded successfully:", imageUrl)
        } catch (uploadError) {
          console.error("[v0] Image upload failed:", uploadError)
          alert("Görsel yüklenirken bir hata oluştu: " + (uploadError as Error).message)
          setIsLoading(false)
          return
        }
      }

      const categoryData = {
        name: formData.name,
        display_order: Number.parseInt(formData.display_order) || 0,
        image_url: imageUrl,
      }

      console.log("[v0] Saving category:", categoryData)

      if (editingCategory) {
        const { error } = await supabase.from("categories").update(categoryData).eq("id", editingCategory.id)

        if (error) {
          console.error("[v0] Update error:", error)
          throw error
        }
      } else {
        const { error } = await supabase.from("categories").insert(categoryData)

        if (error) {
          console.error("[v0] Insert error:", error)
          throw error
        }
      }

      console.log("[v0] Category saved successfully")
      await loadCategories()
      handleCloseModal()
    } catch (error) {
      console.error("[v0] Save error:", error)
      alert("Kategori kaydedilirken bir hata oluştu: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return

    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting category:", error)
      alert("Kategori silinirken bir hata oluştu")
      return
    }

    await loadCategories()
  }

  const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Kategori Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Ürün kategorilerinizi organize edin</p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Yeni Kategori
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <Card key={category.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {category.image_url ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={category.image_url || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`w-12 h-12 rounded-lg ${colors[index % colors.length]} flex items-center justify-center flex-shrink-0`}
                >
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.product_count} ürün</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 gap-2" onClick={() => handleOpenModal(category)}>
                <Pencil className="w-4 h-4" />
                Düzenle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-destructive hover:text-destructive"
                onClick={() => handleDelete(category.id)}
              >
                <Trash2 className="w-4 h-4" />
                Sil
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold">{editingCategory ? "Kategori Düzenle" : "Yeni Kategori Ekle"}</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Kategori adını girin"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori Görseli</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden relative border-2 border-border">
                      <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-input rounded-lg hover:border-ring transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">{imageFile ? imageFile.name : "Görsel Seç"}</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sıralama</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
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
