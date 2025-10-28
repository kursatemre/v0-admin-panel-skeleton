"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Palette, Type, Radius, Sparkles } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

const PATTERNS = [
  { id: "none", name: "Desensiz" },
  { id: "dots", name: "Noktalar" },
  { id: "grid", name: "Izgara" },
  { id: "diagonal", name: "Çizgiler" },
  { id: "waves", name: "Dalgalar" },
]

const FONT_SIZES = [
  { id: "small", name: "Küçük", value: "0.9" },
  { id: "medium", name: "Orta", value: "1.0" },
  { id: "large", name: "Büyük", value: "1.1" },
  { id: "xlarge", name: "Çok Büyük", value: "1.2" },
]

const BORDER_RADIUS = [
  { id: "none", name: "Köşesiz", value: "0" },
  { id: "small", name: "Az", value: "0.375" },
  { id: "medium", name: "Orta", value: "0.5" },
  { id: "large", name: "Çok", value: "1" },
]

export function DisplaySettings() {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [accentColor, setAccentColor] = useState("#ef4444")
  const [backgroundPattern, setBackgroundPattern] = useState("none")
  const [fontSize, setFontSize] = useState("medium")
  const [borderRadius, setBorderRadius] = useState("medium")
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
      } else if (setting.setting_key === "font_size") {
        setFontSize(setting.setting_value)
      } else if (setting.setting_key === "border_radius") {
        setBorderRadius(setting.setting_value)
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
        { setting_key: "font_size", setting_value: fontSize },
        { setting_key: "border_radius", setting_value: borderRadius },
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

  const getPatternPreview = (patternId: string) => {
    const color = accentColor
    switch (patternId) {
      case "dots":
        return {
          backgroundImage: `radial-gradient(circle, ${color}40 2px, transparent 2px)`,
          backgroundSize: "20px 20px",
        }
      case "grid":
        return {
          backgroundImage: `linear-gradient(${color}40 1px, transparent 1px), linear-gradient(90deg, ${color}40 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }
      case "diagonal":
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${color}40, ${color}40 1px, transparent 1px, transparent 10px)`,
        }
      case "waves":
        return {
          backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${color}20 10px, transparent 20px)`,
        }
      default:
        return {}
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Görünüm Ayarları</h1>
        <p className="text-muted-foreground mt-1">Menü stilini ve görünüm ayarlarını özelleştirin</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Renk Ayarları</h3>
            <p className="text-sm text-muted-foreground">Menü renk paletini özelleştirin</p>
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
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Arka Plan Deseni</h3>
            <p className="text-sm text-muted-foreground">Arka plana eklenecek dekoratif deseni seçin</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {PATTERNS.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => setBackgroundPattern(pattern.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                backgroundPattern === pattern.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className="aspect-square rounded mb-2 border border-border"
                style={{
                  backgroundColor: backgroundColor,
                  ...getPatternPreview(pattern.id),
                }}
              />
              <p className="text-xs font-medium text-center">{pattern.name}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Type className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Yazı Boyutu</h3>
            <p className="text-sm text-muted-foreground">Menüdeki yazı boyutunu ayarlayın</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {FONT_SIZES.map((size) => (
            <button
              key={size.id}
              onClick={() => setFontSize(size.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                fontSize === size.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-medium mb-1" style={{ fontSize: `${Number.parseFloat(size.value)}rem` }}>
                Aa
              </p>
              <p className="text-xs text-muted-foreground">{size.name}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Radius className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Köşe Yuvarlaklığı</h3>
            <p className="text-sm text-muted-foreground">Kartların köşe yuvarlaklığını ayarlayın</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {BORDER_RADIUS.map((radius) => (
            <button
              key={radius.id}
              onClick={() => setBorderRadius(radius.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                borderRadius === radius.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className="w-12 h-12 bg-primary/20 mx-auto mb-2"
                style={{ borderRadius: `${Number.parseFloat(radius.value)}rem` }}
              />
              <p className="text-xs text-muted-foreground">{radius.name}</p>
            </button>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" disabled={isLoading} className="gap-2">
          {isLoading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </Button>
      </div>
    </div>
  )
}
