import { newsArticleSchema, type NewsArticle } from "@/types/news";
import type { ContentRepository } from "../repository";
import rawNews from "../data/news.sample.json";

// Aşama 1 için geçici, örnek/yer tutucu veri. Gerçek haber içeriği `legacy/data`dan
// Supabase'e taşınana kadar (bkz. CLAUDE.md > Geliştirme sırası, adım 8) bu kaynak
// sadece veri katmanı mimarisini kanıtlamak için kullanılır.
function loadNews(): NewsArticle[] {
  return rawNews.map((item) => newsArticleSchema.parse(item));
}

export function createJsonContentRepository(): ContentRepository {
  const news = loadNews();

  return {
    async getAllNews() {
      return news;
    },
    async getFeaturedNews() {
      return news.filter((article) => article.featured);
    },
    async getNewsBySlug(slug: string) {
      return news.find((article) => article.slug === slug) ?? null;
    },
  };
}
