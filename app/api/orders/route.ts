import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, first_name, last_name, phone, quantity } = body

    if (!product_id || !first_name || !last_name || !phone || !quantity) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("orders")
      .insert({
        product_id,
        first_name,
        last_name,
        phone,
        quantity,
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
