import { NextResponse } from "next/server"

export async function POST() {
  try {
    const connectionString = process.env.SUPABASE_POSTGRES_URL || process.env.POSTGRES_URL

    if (!connectionString) {
      throw new Error("Veritabanı bağlantı bilgisi bulunamadı")
    }

    // Use node-postgres to execute raw SQL
    const { Client } = await import("pg")
    const client = new Client({ connectionString })

    try {
      await client.connect()

      console.log("[v0] Running migration: Adding pre_order_enabled column...")
      await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS pre_order_enabled BOOLEAN DEFAULT false;`)

      console.log("[v0] Running migration: Creating orders table...")
      await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `)

      console.log("[v0] Running migration: Creating indexes...")
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
      `)

      await client.end()

      console.log("[v0] Migration completed successfully!")

      return NextResponse.json({
        success: true,
        message: "Migration başarıyla tamamlandı! Artık ön sipariş özelliğini kullanabilirsiniz.",
      })
    } catch (error) {
      await client.end()
      throw error
    }
  } catch (error) {
    console.error("[v0] Migration error:", error)
    return NextResponse.json(
      {
        error: "Migration başarısız: " + (error as Error).message,
        details: "Lütfen SQL scriptini manuel olarak Supabase dashboard'da çalıştırın.",
      },
      { status: 500 },
    )
  }
}
