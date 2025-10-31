"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Copy } from "lucide-react"

const MIGRATION_SQL = `-- Add pre_order_enabled column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS pre_order_enabled BOOLEAN DEFAULT false;

-- Create orders table with simplified fields
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);`

export function MigrationRunner() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(MIGRATION_SQL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Failed to copy
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Veritabanı Migration</CardTitle>
        <CardDescription>Ön sipariş sistemini aktif etmek için SQL scriptini çalıştırın</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Bu işlem şunları yapacak:</p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>
              Products tablosuna <code className="text-xs bg-muted px-1 py-0.5 rounded">pre_order_enabled</code> kolonu
              ekleyecek
            </li>
            <li>
              Yeni <code className="text-xs bg-muted px-1 py-0.5 rounded">orders</code> tablosu oluşturacak
            </li>
            <li>Ön sipariş sistemini aktif edecek</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Adımlar:</p>
          <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
            <li>Aşağıdaki "SQL'i Kopyala" butonuna tıklayın</li>
            <li>Supabase Dashboard'a gidin (SQL Editor bölümü)</li>
            <li>Kopyalanan SQL'i yapıştırın ve çalıştırın</li>
            <li>Sayfayı yenileyin ve ön sipariş özelliğini kullanmaya başlayın</li>
          </ol>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">{MIGRATION_SQL}</pre>
        </div>

        <Button onClick={copyToClipboard} className="w-full" variant={copied ? "outline" : "default"}>
          {copied ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Kopyalandı!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              SQL'i Kopyala
            </>
          )}
        </Button>

        {copied && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              SQL kopyalandı! Şimdi Supabase Dashboard'da SQL Editor'e yapıştırıp çalıştırın.
            </AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-muted-foreground">
          Not: Bu SQL scripti güvenli bir şekilde birden fazla kez çalıştırılabilir (IF NOT EXISTS kullanıyor).
        </p>
      </CardContent>
    </Card>
  )
}
