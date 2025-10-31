import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

// GET - Fetch all orders
export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        products (
          name,
          price,
          image_url
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Siparişler yüklenemedi" }, { status: 500 })
    }

    return NextResponse.json({ orders: data })
  } catch (error) {
    console.error("Error in orders GET API:", error)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, first_name, last_name, phone, quantity, notes, created_by } = body

    if (!product_id || !first_name || !last_name || !phone || !quantity) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("orders")
      .insert({
        product_id,
        first_name,
        last_name,
        phone,
        quantity,
        notes: notes || null,
        status: "pending",
        created_by: created_by || "customer",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating order:", error)
      return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: data })
  } catch (error) {
    console.error("Error in orders POST API:", error)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}

// PATCH - Update order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "ID ve durum gerekli" }, { status: 400 })
    }

    const validStatuses = ["pending", "confirmed", "ready", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Geçersiz durum" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json({ error: "Sipariş güncellenemedi" }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: data })
  } catch (error) {
    console.error("Error in orders PATCH API:", error)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}
