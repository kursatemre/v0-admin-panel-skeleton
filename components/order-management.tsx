"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Phone, Mail, Package, Clock } from "lucide-react"
import { getSupabaseBrowserClient, initSupabaseClient } from "@/lib/supabase-client"
import type { SupabaseClient } from "@supabase/supabase-js"

interface Order {
  id: string
  product_id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  quantity: number
  notes?: string
  status: "pending" | "confirmed" | "ready" | "completed" | "cancelled"
  created_at: string
  products?: {
    name: string
    price: number
  }
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
  const [isLoading, setIsLoading] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const init = async () => {
      await initSupabaseClient()
      const client = getSupabaseBrowserClient()
      setSupabase(client)
    }
    init()
  }, [])

  useEffect(() => {
    if (supabase) {
      fetchOrders()
    }
  }, [supabase])

  const fetchOrders = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          products (
            name,
            price
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!supabase) return

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId)

      if (error) throw error
      await fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sipariş Yönetimi</h2>
        <p className="text-muted-foreground">Ön siparişleri görüntüleyin ve yönetin</p>
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
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Müşteri:</span>
                      <span>{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer_phone}</span>
                    </div>
                    {order.customer_email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{order.customer_email}</span>
                      </div>
                    )}
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
                  <div className="rounded-lg bg-muted p-3">
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
    </div>
  )
}
