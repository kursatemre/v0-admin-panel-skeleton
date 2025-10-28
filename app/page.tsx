"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ProductManagement } from "@/components/product-management"
import { CategoryManagement } from "@/components/category-management"
import { DisplaySettings } from "@/components/display-settings"

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<"products" | "categories" | "settings">("products")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 lg:p-8">
          {activeSection === "products" && <ProductManagement />}
          {activeSection === "categories" && <CategoryManagement />}
          {activeSection === "settings" && <DisplaySettings />}
        </div>
      </main>
    </div>
  )
}
