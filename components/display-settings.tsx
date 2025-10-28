"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Palette, Type, Radius, Sparkles, FileText } from "lucide-react"
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
  const [pageBgColor, setPageBgColor] = useState("#f9fafb")
  const [contentAreaBgColor, setContentAreaBgColor] = useState("#ffffff")
  const [headerBgColor, setHeaderBgColor] = useState("#1f2937")
  const [headerTextColor, setHeaderTextColor] = useState("#ffffff")
  const [categoryBgColor, setCategoryBgColor] = useState("#f3f4f6")
  const [categoryTextColor, setCategoryTextColor] = useState("#111827")
  const [productBgColor, setProductBgColor] = useState("#ffffff")
  const [productNameColor, setProductNameColor] = useState("#111827")
  const [productDescColor, setProductDescColor] = useState("#6b7280")
  const [priceColor, setPriceColor] = useState("#ef4444")
  const [priceBgColor, setPriceBgColor] = useState("#fef2f2")

  const [headerTitle, setHeaderTitle] = useState("Menümüz")
  const [headerSubtitle, setHeaderSubtitle] = useState("Lezzetli yemeklerimizi keşfedin")
  const [headerLogoUrl, setHeaderLogoUrl] = useState("")
  const [footerText, setFooterText] = useState("Afiyet olsun!")
  const [footerLogoUrl, setFooterLogoUrl] = useState("")
  const [uploadingHeaderLogo, setUploadingHeaderLogo] = useState(false)
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false)

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
      switch (setting.setting_key) {
        case "background_color":
          setBackgroundColor(setting.setting_value)
          break
        case "accent_color":
          setAccentColor(setting.setting_value)
          break
        case "page_bg_color":
          setPageBgColor(setting.setting_value)
          break
        case "content_area_bg_color":
          setContentAreaBgColor(setting.setting_value)
          break
        case "header_bg_color":
          setHeaderBgColor(setting.setting_value)
          break
        case "header_text_color":
          setHeaderTextColor(setting.setting_value)
          break
        case "category_bg_color":
          setCategoryBgColor(setting.setting_value)
          break
        case "category_text_color":
          setCategoryTextColor(setting.setting_value)
          break
        case "product_bg_color":
          setProductBgColor(setting.setting_value)
          break
        case "product_name_color":
          setProductNameColor(setting.setting_value)
          break
        case "product_desc_color":
          setProductDescColor(setting.setting_value)
          break
        case "price_color":
          setPriceColor(setting.setting_value)
          break
        case "price_bg_color":
          setPriceBgColor(setting.setting_value)
          break
        case "background_pattern":
          setBackgroundPattern(setting.setting_value)
          break
        case "font_size":
          setFontSize(setting.setting_value)
          break
        case "border_radius":
          setBorderRadius(setting.setting_value)
          break
        case "header_title":
          setHeaderTitle(setting.setting_value)
          break
        case "header_subtitle":
          setHeaderSubtitle(setting.setting_value)
          break
        case "header_logo_url":
          setHeaderLogoUrl(setting.setting_value)
          break
        case "footer_text":
          setFooterText(setting.setting_value)
          break
        case "footer_logo_url":
          setFooterLogoUrl(setting.setting_value)
          break
      }
    })
  }

  const handleHeaderLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingHeaderLogo(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { url } = await response.json()
      setHeaderLogoUrl(url)
    } catch (error) {
      alert("Logo yüklenirken bir hata oluştu")
    } finally {
      setUploadingHeaderLogo(false)
    }
  }

  const handleFooterLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFooterLogo(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { url } = await response.json()
      setFooterLogoUrl(url)
    } catch (error) {
      alert("Logo yüklenirken bir hata oluştu")
    } finally {
      setUploadingFooterLogo(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const settings = [
        { setting_key: "background_color", setting_value: backgroundColor },
        { setting_key: "accent_color", setting_value: accentColor },
        { setting_key: "page_bg_color", setting_value: pageBgColor },
        { setting_key: "content_area_bg_color", setting_value: contentAreaBgColor },
        { setting_key: "header_bg_color", setting_value: headerBgColor },
        { setting_key: "header_text_color", setting_value: headerTextColor },
        { setting_key: "category_bg_color", setting_value: categoryBgColor },
        { setting_key: "category_text_color", setting_value: categoryTextColor },
        { setting_key: "product_bg_color", setting_value: productBgColor },
        { setting_key: "product_name_color", setting_value: productNameColor },
        { setting_key: "product_desc_color", setting_value: productDescColor },
        { setting_key: "price_color", setting_value: priceColor },
        { setting_key: "price_bg_color", setting_value: priceBgColor },
        { setting_key: "background_pattern", setting_value: backgroundPattern },
        { setting_key: "font_size", setting_value: fontSize },
        { setting_key: "border_radius", setting_value: borderRadius },
        { setting_key: "header_title", setting_value: headerTitle },
        { setting_key: "header_subtitle", setting_value: headerSubtitle },
        { setting_key: "header_logo_url", setting_value: headerLogoUrl },
        { setting_key: "footer_text", setting_value: footerText },
        { setting_key: "footer_logo_url", setting_value: footerLogoUrl },
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

  const ColorPicker = ({
    label,
    description,
    value,
    onChange,
  }: { label: string; description: string; value: string; onChange: (value: string) => void }) => {
    const [hexInput, setHexInput] = useState(value)

    useEffect(() => {
      setHexInput(value)
    }, [value])

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setHexInput(newValue)

      // Validate hex color (with or without #)
      const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
      if (hexRegex.test(newValue)) {
        const formattedHex = newValue.startsWith("#") ? newValue : `#${newValue}`
        onChange(formattedHex)
      }
    }

    return (
      <div className="space-y-3">
        <Label className="text-base font-medium">{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-20 rounded-lg border-2 border-border cursor-pointer"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={hexInput}
                onChange={handleHexChange}
                placeholder="#000000"
                className="font-mono text-sm w-32"
                maxLength={7}
              />
              <div className="flex-1 h-10 rounded-lg border-2 border-border" style={{ backgroundColor: value }} />
            </div>
          </div>
        </div>
      </div>
    )
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
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Header Özelleştirme</h3>
            <p className="text-sm text-muted-foreground">Üst başlık alanının içeriğini düzenleyin</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Header Başlık</Label>
            <Input
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              placeholder="Menümüz"
              className="text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Header Alt Başlık</Label>
            <Input
              value={headerSubtitle}
              onChange={(e) => setHeaderSubtitle(e.target.value)}
              placeholder="Lezzetli yemeklerimizi keşfedin"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Header Logo</Label>
            <p className="text-sm text-muted-foreground">Başlıkta görünecek logo (opsiyonel)</p>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleHeaderLogoUpload}
                disabled={uploadingHeaderLogo}
                className="flex-1"
              />
              {headerLogoUrl && (
                <div className="relative w-16 h-16 rounded-lg border-2 border-border overflow-hidden flex-shrink-0">
                  <img
                    src={headerLogoUrl || "/placeholder.svg"}
                    alt="Header Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            {uploadingHeaderLogo && <p className="text-sm text-muted-foreground">Yükleniyor...</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Footer Özelleştirme</h3>
            <p className="text-sm text-muted-foreground">Alt bilgi alanının içeriğini düzenleyin</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Footer Yazısı</Label>
            <Textarea
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="Afiyet olsun!"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Footer Logo</Label>
            <p className="text-sm text-muted-foreground">Alt bilgide görünecek logo (opsiyonel)</p>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFooterLogoUpload}
                disabled={uploadingFooterLogo}
                className="flex-1"
              />
              {footerLogoUrl && (
                <div className="relative w-16 h-16 rounded-lg border-2 border-border overflow-hidden flex-shrink-0">
                  <img
                    src={footerLogoUrl || "/placeholder.svg"}
                    alt="Footer Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            {uploadingFooterLogo && <p className="text-sm text-muted-foreground">Yükleniyor...</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Genel Renk Ayarları</h3>
            <p className="text-sm text-muted-foreground">Temel renk paletini özelleştirin</p>
          </div>
        </div>

        <div className="space-y-6">
          <ColorPicker
            label="Sayfa Arka Plan Rengi"
            description="Tüm sayfanın ana arka plan rengi (beyaz alanlar)"
            value={pageBgColor}
            onChange={setPageBgColor}
          />
          <ColorPicker
            label="İçerik Alanı Arka Planı"
            description="Kategori ve ürün kartları arasındaki boşlukların rengi"
            value={contentAreaBgColor}
            onChange={setContentAreaBgColor}
          />
          <ColorPicker
            label="Arka Plan Rengi"
            description="Mobil ve TV menüleri için ana arka plan rengi"
            value={backgroundColor}
            onChange={setBackgroundColor}
          />
          <ColorPicker
            label="Vurgu Rengi"
            description="Butonlar ve vurgular için kullanılacak ana renk"
            value={accentColor}
            onChange={setAccentColor}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Header Renkleri</h3>
            <p className="text-sm text-muted-foreground">Üst başlık alanının renklerini ayarlayın</p>
          </div>
        </div>

        <div className="space-y-6">
          <ColorPicker
            label="Header Arka Plan"
            description="Üst başlık alanının arka plan rengi"
            value={headerBgColor}
            onChange={setHeaderBgColor}
          />
          <ColorPicker
            label="Header Yazı Rengi"
            description="Üst başlıktaki yazı ve simge rengi"
            value={headerTextColor}
            onChange={setHeaderTextColor}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Kategori Renkleri</h3>
            <p className="text-sm text-muted-foreground">Kategori başlıklarının renklerini ayarlayın</p>
          </div>
        </div>

        <div className="space-y-6">
          <ColorPicker
            label="Kategori Arka Plan"
            description="Kategori başlıklarının arka plan rengi"
            value={categoryBgColor}
            onChange={setCategoryBgColor}
          />
          <ColorPicker
            label="Kategori Yazı Rengi"
            description="Kategori isimlerinin yazı rengi"
            value={categoryTextColor}
            onChange={setCategoryTextColor}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Ürün Renkleri</h3>
            <p className="text-sm text-muted-foreground">Ürün kartlarının renklerini ayarlayın</p>
          </div>
        </div>

        <div className="space-y-6">
          <ColorPicker
            label="Ürün Arka Plan"
            description="Ürün kartlarının arka plan rengi"
            value={productBgColor}
            onChange={setProductBgColor}
          />
          <ColorPicker
            label="Ürün Adı Rengi"
            description="Ürün isimlerinin yazı rengi"
            value={productNameColor}
            onChange={setProductNameColor}
          />
          <ColorPicker
            label="Açıklama Rengi"
            description="Ürün açıklamalarının yazı rengi"
            value={productDescColor}
            onChange={setProductDescColor}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Fiyat Renkleri</h3>
            <p className="text-sm text-muted-foreground">Fiyat etiketlerinin renklerini ayarlayın</p>
          </div>
        </div>

        <div className="space-y-6">
          <ColorPicker
            label="Fiyat Yazı Rengi"
            description="Fiyat rakamlarının rengi"
            value={priceColor}
            onChange={setPriceColor}
          />
          <ColorPicker
            label="Fiyat Arka Plan"
            description="Fiyat etiketinin arka plan rengi"
            value={priceBgColor}
            onChange={setPriceBgColor}
          />
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
