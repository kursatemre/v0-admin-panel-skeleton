"use client"

import { useState, useRef, useEffect } from "react"
import { QrCode, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function QRGenerator() {
  const [menuUrl, setMenuUrl] = useState("")
  const [qrSize, setQrSize] = useState(300)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Get the current domain
    if (typeof window !== "undefined") {
      setMenuUrl(`${window.location.origin}/menu`)
    }
  }, [])

  useEffect(() => {
    if (menuUrl && canvasRef.current) {
      generateQRCode()
    }
  }, [menuUrl, qrSize])

  const generateQRCode = async () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simple QR code generation using canvas
    // For production, you'd use a library like qrcode
    const QRCode = (await import("qrcode")).default

    try {
      await QRCode.toCanvas(canvas, menuUrl, {
        width: qrSize,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
    } catch (error) {
      // QR code generation failed
    }
  }

  const downloadQRCode = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const url = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = "menu-qr-code.png"
    link.href = url
    link.click()
  }

  const openMenuPage = () => {
    window.open(menuUrl, "_blank")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">QR Kod Oluşturucu</h2>
        <p className="text-muted-foreground mt-2">Menü sayfanız için QR kod oluşturun ve müşterilerinizle paylaşın</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Kod Önizleme
            </CardTitle>
            <CardDescription>Müşterileriniz bu QR kodu tarayarak menünüze erişebilir</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <canvas ref={canvasRef} />
            </div>

            <div className="flex gap-2 w-full">
              <Button onClick={downloadQRCode} className="flex-1" variant="default">
                <Download className="w-4 h-4 mr-2" />
                İndir
              </Button>
              <Button onClick={openMenuPage} className="flex-1 bg-transparent" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Menüyü Aç
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>QR Kod Ayarları</CardTitle>
            <CardDescription>QR kodunuzu özelleştirin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="menu-url">Menü URL</Label>
              <Input id="menu-url" value={menuUrl} readOnly className="bg-muted" />
              <p className="text-xs text-muted-foreground">Bu URL otomatik olarak oluşturulur</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qr-size">QR Kod Boyutu: {qrSize}px</Label>
              <input
                id="qr-size"
                type="range"
                min="200"
                max="500"
                step="50"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Küçük</span>
                <span>Büyük</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Kullanım Önerileri</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• QR kodu masalarınıza yerleştirin</li>
                <li>• Vitrin camınıza yapıştırın</li>
                <li>• Sosyal medyada paylaşın</li>
                <li>• Menü kartlarınıza ekleyin</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Nasıl Kullanılır?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">1.</span>
              <span>Yukarıdaki QR kodu indirin veya ekran görüntüsü alın</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">2.</span>
              <span>QR kodu yazdırın veya dijital olarak paylaşın</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">3.</span>
              <span>Müşterileriniz telefon kameralarıyla QR kodu tarayarak menünüze erişebilir</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
