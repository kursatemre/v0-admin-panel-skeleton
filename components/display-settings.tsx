"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Palette, Grid3x3 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

const PATTERNS = [
  { id: "none", name: "Desensiz", preview: "bg-white" },
  { id: "dots", name: "Noktalar", preview: "bg-white" },
  { id: "grid", name: "Izgara", preview: "bg-white" },
  { id: "diagonal", name: "Çizgiler", preview: "bg-white" },
  { id: "waves", name: "Dalgalar", preview: "bg-white" },
]

export function DisplaySettings() {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [accentColor, setAccentColor] = useState("#ef4444")
  const [backgroundPattern, setBackgroundPattern] = useState("none")
  const [isLoading, setIsLoading] = useState(false)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const { data, error } = await supabase.from("display_settings").select("*")

    if (error) {
      return
    }

    data?.forEach((setting) => {
      if (setting.setting_key === "background_color") {
        setBackgroundColor(setting.setting_value)
      } else if (setting.setting_key === "accent_color") {
        setAccentColor(setting.setting_value)
      } else if (setting.setting_key === "background_pattern") {
        setBackgroundPattern(setting.setting_value)
      }
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const settings = [
        { setting_key: "background_color", setting_value: backgroundColor },
        { setting_key: "accent_color", setting_value: accentColor },
        { setting_key: "background_pattern", setting_value: backgroundPattern },
      ]

      for (const setting of settings) {
        const { error } = await supabase.from("display_settings").upsert(setting, { onConflict: "setting_key" })

        if (error) throw error
      }

      alert("Ayarlar başarıyla kaydedildi!")
    } catch (error) {
      alert("Ayarlar kaydedilirken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Görünüm Ayarları</h1>
        <p className="text-muted-foreground mt-1">Menü stilini ve renk ayarlarını yönetin</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Menü Renk Ayarları</h3>
            <p className="text-sm text-muted-foreground">Mobil ve TV menüleri için renk ayarlarını yapılandırın</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="bg-color" className="text-base font-medium">
              Arka Plan Rengi
            </Label>
            <p className="text-sm text-muted-foreground">Mobil ve TV menüleri için arka plan rengini seçin</p>
            <div className="flex items-center gap-4">
              <input
                id="bg-color"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-12 w-20 rounded-lg border-2 border-border cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">{backgroundColor}</span>
                  <div className="w-full h-10 rounded-lg border-2 border-border" style={{ backgroundColor }} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Arka Plan Deseni</Label>
            <p className="text-sm text-muted-foreground">Arka plana eklenecek dekoratif deseni seçin</p>
            <div className="grid grid-cols-5 gap-3">
              {PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => setBackgroundPattern(pattern.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    backgroundPattern === pattern.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-square rounded bg-muted mb-2 flex items-center justify-center">
                    <Grid3x3 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-center">{pattern.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="accent-color" className="text-base font-medium">
              Vurgu Rengi
            </Label>
            <p className="text-sm text-muted-foreground">
              Fiyatlar ve önemli butonlar için kullanılacak vurgu rengini seçin
            </p>
            <div className="flex items-center gap-4">
              <input
                id="accent-color"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-12 w-20 rounded-lg border-2 border-border cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">{accentColor}</span>
                  <div
                    className="w-full h-10 rounded-lg border-2 border-border"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 mt-6 border-t">
          <Button onClick={handleSave} size="lg" disabled={isLoading}>
            {isLoading ? "Kaydediliyor..." : "Ayarları Kaydet"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
