"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ProductManagement } from "@/components/product-management"
import { CategoryManagement } from "@/components/category-management"
import { DisplaySettings } from "@/components/display-settings"
import { QRGenerator } from "@/components/qr-generator"
import { Button } from "@/components/ui/button"
import { LogOut, Monitor, Menu } from "lucide-react"

export default function AdminPanel() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<"products" | "categories" | "settings" | "qr">(
    "products",
  )
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check")
      const data = await response.json()

      if (!data.authenticated) {
        router.push("/login")
      } else {
        setIsAuthenticated(true)
      }
    } catch (error) {
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-y-auto">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.open("/tv", "_blank")}>
                <Monitor className="h-4 w-4 mr-2" />
                TV Ekranı
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open("/menu", "_blank")}>
                <Menu className="h-4 w-4 mr-2" />
                Menü Sayfası
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>

        <div className="container mx-auto p-6 lg:p-8">
          {activeSection === "products" && <ProductManagement />}
          {activeSection === "categories" && <CategoryManagement />}
          {activeSection === "settings" && <DisplaySettings />}
          {activeSection === "qr" && <QRGenerator />}
        </div>
      </main>
    </div>
  )
}
