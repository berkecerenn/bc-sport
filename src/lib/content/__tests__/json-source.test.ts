import { describe, expect, it } from "vitest";
import { createJsonContentRepository } from "../sources/json-source";
import legacyFile from "../../../../legacy/data/haberler.json";

describe("createJsonContentRepository (legacy/data/haberler.json)", () => {
  const repository = createJsonContentRepository();

  it("returns every valid legacy news item, mapped with both TR and EN fields", async () => {
    const news = await repository.getAllNews();
    // legacy dosyasındaki tüm kayıtlar geçerli olduğu için hiçbiri atlanmamalı.
    expect(news.length).toBe(legacyFile.haberler.length);
    for (const article of news) {
      expect(article.slug).toBeTruthy();
      expect(article.title.tr).toBeTruthy();
      expect(article.title.en).toBeTruthy();
      expect(article.summary.tr).toBeTruthy();
      expect(article.summary.en).toBeTruthy();
      expect(article.body.tr.length).toBeGreaterThan(0);
      expect(article.body.en.length).toBeGreaterThan(0);
    }
  });

  it("filters featured (manset) news only", async () => {
    const featured = await repository.getFeaturedNews();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((article) => article.featured)).toBe(true);
  });

  it("finds a real article by slug (legacy id)", async () => {
    const article = await repository.getNewsBySlug(
      "sl-milli-fransa-oncesi-2026-09-25",
    );
    expect(article).not.toBeNull();
    expect(article?.category).toBe("super-lig");
  });

  it("returns null for an unknown slug", async () => {
    const article = await repository.getNewsBySlug("bilinmeyen-slug");
    expect(article).toBeNull();
  });
});
