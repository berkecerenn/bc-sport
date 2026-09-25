# BC Sport

Türkiye ve dünya futbolundan iki dilli (TR/EN) haber, maç, puan durumu ve transfer platformu.

## Durum

Proje, statik HTML/JS sürümünden **Next.js (App Router) + TypeScript + Supabase + Vercel** mimarisine taşınıyor.

| Klasör | İçerik |
|---|---|
| `legacy/` | Eski statik site (referans). Tasarım, veri şemaları ve `data/*.json` içerikleri buradan taşınır. Taşıma bitince silinecek. |
| `legacy/data/` | Mevcut içerik (haberler, maçlar, fikstür, puan, transfer, analizler). Supabase'e seed kaynağı. |
| `legacy/DATA-KURALLARI.md` | Günlük içerik güncelleme kuralları. |

## Hedef mimari (özet)

- **Web:** Next.js App Router, SSG/ISR, `/[locale]` (tr, en) rotaları.
- **Veri:** Supabase Postgres (haberler, kategoriler, ligler, takımlar, maçlar, puan, transferler), Row Level Security.
- **Admin:** Supabase Auth + rol tabanlı panel (admin, editör, yazar).
- **Hosting:** Vercel (GitHub'dan otomatik deploy).
- **SEO:** haber başına metadata, Open Graph, JSON-LD (NewsArticle), sitemap, robots, RSS.

## Geliştirme sırası

1. Temel proje yapısı → 2. Layout/navigasyon → 3. Ana sayfa → 4. Haber sistemi → 5. Kategori sayfaları → 6. Takım/lig sayfaları → 7. Haber detay → 8. Backend/DB → 9. Admin → 10. API/RSS → 11. SEO/performans → 12. Deploy
