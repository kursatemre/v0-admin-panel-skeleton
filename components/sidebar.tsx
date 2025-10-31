"use client"

import { Package, FolderTree, Settings, QrCode, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: "products" | "categories" | "orders" | "settings" | "qr"
  onSectionChange: (section: "products" | "categories" | "orders" | "settings" | "qr") => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const navItems = [
    {
      id: "products" as const,
      label: "Ürün Yönetimi",
      icon: Package,
    },
    {
      id: "categories" as const,
      label: "Kategori Yönetimi",
      icon: FolderTree,
    },
    {
      id: "orders" as const,
      label: "Siparişler",
      icon: ShoppingCart,
    },
    {
      id: "settings" as const,
      label: "Görünüm Ayarları",
      icon: Settings,
    },
    {
      id: "qr" as const,
      label: "QR Kod",
      icon: QrCode,
    },
  ]

  return (
    <aside className="w-20 border-r border-border bg-card flex flex-col items-center py-6 gap-2">
      <div className="mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">A</span>
        </div>
      </div>

      <nav className="flex flex-col gap-2 w-full px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg transition-colors group relative",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium text-center leading-tight">{item.label.split(" ")[0]}</span>

              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
