import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, customer_name, customer_phone, customer_email, quantity, notes } = body

    if (!product_id || !customer_name || !customer_phone || !quantity) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("orders")
      .insert({
        product_id,
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        quantity,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating order:", error)
      return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: data })
  } catch (error) {
    console.error("Error in orders API:", error)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}
