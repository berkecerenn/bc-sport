import { describe, expect, it } from "vitest";
import { createJsonContentRepository } from "../sources/json-source";

describe("createJsonContentRepository", () => {
  const repository = createJsonContentRepository();

  it("returns all news articles with both TR and EN fields populated", async () => {
    const news = await repository.getAllNews();
    expect(news.length).toBeGreaterThan(0);
    for (const article of news) {
      expect(article.title.tr).toBeTruthy();
      expect(article.title.en).toBeTruthy();
      expect(article.summary.tr).toBeTruthy();
      expect(article.summary.en).toBeTruthy();
    }
  });

  it("filters featured news only", async () => {
    const featured = await repository.getFeaturedNews();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((article) => article.featured)).toBe(true);
  });

  it("finds an article by slug", async () => {
    const article = await repository.getNewsBySlug("ornek-haber-1");
    expect(article).not.toBeNull();
    expect(article?.slug).toBe("ornek-haber-1");
  });

  it("returns null for an unknown slug", async () => {
    const article = await repository.getNewsBySlug("bilinmeyen-slug");
    expect(article).toBeNull();
  });
});
