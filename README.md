# Restoran Menü Yönetim Sistemi

Modern bir restoran menü yönetim sistemi. Admin paneli, mobil menü ve TV ekranı görünümü içerir.

## Özellikler

### Admin Paneli (/)
- Ürün yönetimi (ekleme, düzenleme, silme)
- Kategori yönetimi
- Görünüm ayarları (renk temaları)
- Ürün görseli yükleme

### Mobil Menü (/menu)
- Responsive tasarım
- Kategorilere göre gruplandırılmış ürünler
- Genişletilebilir kategori listesi
- Özelleştirilebilir renk teması

### TV Ekranı (/tv)
- Otomatik geçişli slider
- Büyük ve okunabilir yazı tipleri
- Dijital menü panoları için optimize edilmiş
- IP tabanlı erişim kontrolü

## Kurulum

1. Gerekli bağımlılıkları yükleyin:
\`\`\`bash
npm install
\`\`\`

2. Supabase entegrasyonunu yapılandırın ve veritabanı scriptlerini çalıştırın:
   - `scripts/01-create-tables.sql` - Tabloları oluşturur
   - `scripts/02-seed-data.sql` - Örnek verileri ekler

3. Ortam değişkenlerini ayarlayın:
\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# TV IP Kısıtlaması (virgülle ayrılmış IP listesi)
ALLOWED_TV_IPS=192.168.1.100,192.168.1.101
\`\`\`

4. Geliştirme sunucusunu başlatın:
\`\`\`bash
npm run dev
\`\`\`

## TV Ekranı IP Kısıtlaması

TV ekranı (/tv) rotası, güvenlik için IP tabanlı erişim kontrolü kullanır.

### Yapılandırma

`ALLOWED_TV_IPS` ortam değişkenine yetkili IP adreslerini ekleyin:

\`\`\`env
ALLOWED_TV_IPS=192.168.1.100,192.168.1.101,10.0.0.50
\`\`\`

### Notlar

- Eğer `ALLOWED_TV_IPS` ayarlanmamışsa, geliştirme kolaylığı için tüm IP'lere izin verilir
- Production ortamında mutlaka IP listesi yapılandırılmalıdır
- Yetkisiz erişim denemeleri 403 hatası döndürür

## Teknolojiler

- Next.js 16
- React 19
- Tailwind CSS v4
- Supabase (PostgreSQL)
- Vercel Blob (Görsel depolama)
- TypeScript

## Lisans

MIT
