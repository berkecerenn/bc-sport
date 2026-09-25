# CLAUDE.md: BC Sport

Bu dosya, bu repoda çalışan her Claude Code oturumunun ilk okuduğu talimattır. Kısa tut, güncel tut.

## Proje
BC Sport: Türkiye ve dünya futbolundan iki dilli (TR/EN) haber, maç merkezi, puan durumu, transfer ve yazar köşesi sitesi. Sahibi: Berke Ceren. Gerçek, büyüyecek bir production projesi; demo değil.

## Kararlar (Berke onayladı, 25 Eylül 2026)
- **Web:** Next.js (App Router) + TypeScript (strict). Sunucu bileşenleri varsayılan; istemci bileşeni yalnızca etkileşim gerekiyorsa.
- **Veri:** Supabase (Postgres + Auth + Storage), Row Level Security zorunlu. Supabase org: `berkeceren` (henüz proje yok).
- **Hosting:** Vercel (GitHub `main` → production, PR → preview). Hobby plan ticari kullanıma kapalı: reklam/AdSense açılmadan önce Pro'ya geçiş Berke'ye sorulur.
- **Dil:** `/tr` ve `/en` rotaları; varsayılan `tr`.
- **Eski site:** `legacy/` sadece referans (tasarım, veri şeması, içerik). Değiştirme; taşıma bitince silinecek.

## Hedef klasör yapısı
```
src/
  app/[locale]/          sayfalar (ana sayfa, haber/[slug], lig/[lig], takim/[slug], mac/[id], puan-durumu, transfer, kose)
  app/api/               route handler'lar (RSS, revalidate webhook, ileride public API)
  components/            UI bileşenleri (ui/, layout/, news/, match/, ads/)
  lib/content/           veri katmanı: repository arayüzü + kaynaklar (json → supabase)
  lib/i18n/              sözlükler ve yardımcılar
  lib/seo/               metadata, JSON-LD, sitemap yardımcıları
  types/                 paylaşılan tipler (zod şemalarından türetilir)
supabase/migrations/     SQL migration'ları
scripts/                 seed/import (legacy/data → Supabase)
```
Veri erişimi her zaman `lib/content` üzerinden; sayfalar doğrudan JSON veya Supabase istemcisi kullanmaz. Böylece kaynak değişince sayfalar değişmez.

## Geliştirme sırası
1. Temel proje yapısı (Next.js iskeleti, lint/typecheck/test, CSS tokenları, veri katmanı JSON kaynağıyla) ← **sıradaki adım**
2. Layout/navigation → 3. Ana sayfa → 4. Haber sistemi → 5. Kategori sayfaları → 6. Takım/lig sayfaları → 7. Haber detay → 8. Supabase DB → 9. Admin → 10. API/RSS → 11. SEO/performans → 12. Deploy

## Çalışma kuralları
- Her önemli değişiklikten sonra çalıştır: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`. Hata varsa önce kendin düzelt, sonra tekrar çalıştır. Kırık build ile commit yok.
- Mevcut kodu gereksiz yere yeniden yazma. Değişiklikten önce etkisini kontrol et.
- Berke'ye yalnızca şunu raporla: ne yapıldı, hangi dosyalar, neden, test/build sonucu, onun karar vermesi gereken noktalar. Kod parçası kopyalatma.
- **Önce Berke'ye sor:** mimariyi ciddi etkileyen, maliyet oluşturan (ücretli plan, eklenti, alan adı), güvenlik riski taşıyan veya geri dönüşü zor kararlar. Küçük ve net işler için soru sorma, uygula.
- Gizli anahtar asla repoya girmez: `.env.local` (git'te yok) + Vercel ortam değişkenleri. `.env.example` güncel tutulur. Supabase `service_role` anahtarı yalnızca sunucuda.
- Kullanıcıdan/dışarıdan gelen metin HTML olarak basılmaz (React varsayılan kaçışı; `dangerouslySetInnerHTML` yasak, gerekiyorsa sanitize + gerekçe).
- Erişilebilirlik: anlamlı HTML, alt metin, klavye ile gezinme, kontrast. Responsive: mobil önce.
- Performans: `next/image`, sayfalama, gereksiz istemci JS yok, veri sayfa başına sadece gerekeni çeker.

## Maliyet / model kullanımı
- Basit ve net işler (küçük düzenleme, CSS, typo, basit refactor, config) için alt ajanı düşük maliyetli modelle çalıştır (`model: haiku` veya `sonnet`). Gereksiz uzun analiz yapma.
- Güçlü model yalnızca mimari, büyük refactor, karmaşık debugging, DB/auth/güvenlik ve entegrasyonlar için.
- Kalite, tasarruf uğruna düşürülmez.

## İçerik kuralları
Haber/maç/puan verisi için `legacy/DATA-KURALLARI.md` geçerli (doğrulanmış bilgi, en az iki kaynak, kendi cümlelerimiz, TR+EN, telifli görsel/arma yok). Veri Supabase'e taşınınca bu dosya repo köküne `docs/` altında güncellenir.

## Marka
BC Sport. Renkler: mavi #2563EB, turkuaz #06B6D4, mor #7C3AED, yeşil #10B981 (yalnızca canlı/gol), mürekkep #111827, buz beyazı #F8FAFC. Beyaz tema. Logo: `legacy/img/marka/`.
