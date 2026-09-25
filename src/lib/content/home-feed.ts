import type { NewsArticle } from "@/types/news";

export type HomeFeed = {
  hero: NewsArticle | null;
  sideList: NewsArticle[];
  gridList: NewsArticle[];
};

// legacy/js/app.js > ekraniYenile() ile aynı mantık: editörün "manset: true"
// işaretlediği haber varsa (stabil sıralama; diğer haberlerin sırası bozulmaz)
// manşete o çıkar, yoksa listedeki ilk (en yeni) haber manşete çıkar. Manşetin
// yanına sıradaki 5 haber (sideList), altına kalanı (gridList) yerleştirilir.
export function buildHomeFeed(articles: NewsArticle[]): HomeFeed {
  if (articles.length === 0) {
    return { hero: null, sideList: [], gridList: [] };
  }

  const featuredIndex = articles.findIndex((article) => article.featured);
  const ordered =
    featuredIndex > 0
      ? [
          articles[featuredIndex],
          ...articles.slice(0, featuredIndex),
          ...articles.slice(featuredIndex + 1),
        ]
      : articles;

  return {
    hero: ordered[0] ?? null,
    sideList: ordered.slice(1, 6),
    gridList: ordered.slice(6),
  };
}
