import type { NewsArticle } from "@/types/news";

// Sayfalar veriye her zaman bu arayüz üzerinden erişir; kaynak (JSON → Supabase)
// değiştiğinde sayfa kodu değişmez. Bkz. CLAUDE.md > Hedef klasör yapısı.
export interface ContentRepository {
  getAllNews(): Promise<NewsArticle[]>;
  getFeaturedNews(): Promise<NewsArticle[]>;
  getNewsBySlug(slug: string): Promise<NewsArticle | null>;
}
