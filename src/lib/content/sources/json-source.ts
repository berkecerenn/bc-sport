import type { ContentRepository } from "../repository";
import { loadLegacyNews } from "./legacy-news-source";

// Aşama 8'e kadar (Supabase DB) tek kaynak legacy/data/haberler.json'dur
// (bkz. legacy-news-source.ts). Sayfalar bu repository'yi `../index.ts` üzerinden kullanır.
export function createJsonContentRepository(): ContentRepository {
  const news = loadLegacyNews();

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
