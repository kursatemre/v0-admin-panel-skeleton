export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md text-center space-y-4 p-8">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold">Erişim Engellendi</h1>
        <p className="text-muted-foreground leading-relaxed">
          Bu sayfaya erişim yetkiniz bulunmamaktadır. TV menüsü sadece yetkili IP adreslerinden görüntülenebilir.
        </p>
        <p className="text-sm text-muted-foreground mt-6">Yardım için lütfen sistem yöneticinizle iletişime geçin.</p>
      </div>
    </div>
  )
}
