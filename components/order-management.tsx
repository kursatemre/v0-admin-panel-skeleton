"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Phone, Package, Clock, User, Plus, X } from "lucide-react"
import { initSupabaseClient } from "@/lib/supabase-client"
import type { SupabaseClient } from "@supabase/supabase-js"

interface Order {
  id: string
  product_id: string
  first_name: string
  last_name: string
  phone: string
  quantity: number
  status: "pending" | "confirmed" | "ready" | "completed" | "cancelled"
  notes?: string
  created_by: string
  created_at: string
  products?: {
    name: string
    price: number
    image_url?: string
  }
}

interface Product {
  id: string
  name: string
  price: number
  order_enabled: boolean
}

const statusLabels = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  ready: "Hazır",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi",
}

const statusColors = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  ready: "bg-green-500",
  completed: "bg-gray-500",
  cancelled: "bg-red-500",
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    product_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    quantity: 1,
    notes: "",
  })

  useEffect(() => {
    const init = async () => {
      await initSupabaseClient()
      const client = await initSupabaseClient()
      setSupabase(client)
    }
    init()
  }, [])

  useEffect(() => {
    if (supabase) {
      fetchOrders()
      fetchProducts()
    }
  }, [supabase])

  const fetchOrders = async () => {
    if (!supabase) return

    try {
      const response = await fetch("/api/orders")
      const data = await response.json()

      if (data.orders) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProducts = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, order_enabled")
        .eq("is_active", true)
        .eq("order_enabled", true)
        .order("name")

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })

      if (!response.ok) throw new Error("Durum güncellenemedi")

      await fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Sipariş durumu güncellenirken bir hata oluştu")
    }
  }

  const handleCreateOrder = async () => {
    if (!formData.product_id || !formData.first_name || !formData.last_name || !formData.phone) {
      alert("Lütfen tüm zorunlu alanları doldurun")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          created_by: "admin",
        }),
      })

      if (!response.ok) throw new Error("Sipariş oluşturulamadı")

      alert("Sipariş başarıyla oluşturuldu!")
      setIsModalOpen(false)
      setFormData({
        product_id: "",
        first_name: "",
        last_name: "",
        phone: "",
        quantity: 1,
        notes: "",
      })
      await fetchOrders()
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Sipariş oluşturulurken bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!supabase || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sipariş Yönetimi</h2>
          <p className="text-muted-foreground">Siparişleri görüntüleyin ve yönetin</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Manuel Sipariş Oluştur
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz sipariş bulunmuyor</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{order.products?.name || "Ürün"}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {new Date(order.created_at).toLocaleString("tr-TR")}
                      {order.created_by === "admin" && (
                        <Badge variant="outline" className="ml-2">
                          Admin
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Müşteri:</span>
                      <span>
                        {order.first_name} {order.last_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{order.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Adet:</span>
                      <span>{order.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Toplam:</span>
                      <span className="font-semibold">
                        {((order.products?.price || 0) * order.quantity).toFixed(2)} ₺
                      </span>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-1">Not:</p>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Durum:</span>
                  <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Beklemede</SelectItem>
                      <SelectItem value="confirmed">Onaylandı</SelectItem>
                      <SelectItem value="ready">Hazır</SelectItem>
                      <SelectItem value="completed">Tamamlandı</SelectItem>
                      <SelectItem value="cancelled">İptal Edildi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Manuel Sipariş Oluşturma Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Manuel Sipariş Oluştur</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ürün *</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Ürün seçin</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.price.toFixed(2)} ₺
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ad *</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Müşteri adı"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Soyad *</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Müşteri soyadı"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telefon *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Adet *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Not (Opsiyonel)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ek notlar..."
                  rows={3}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                İptal
              </Button>
              <Button onClick={handleCreateOrder} disabled={isSubmitting}>
                {isSubmitting ? "Oluşturuluyor..." : "Sipariş Oluştur"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
