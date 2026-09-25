import { describe, expect, it } from "vitest";
import { buildHomeFeed } from "../home-feed";
import type { NewsArticle } from "@/types/news";

function makeArticle(id: string, featured = false): NewsArticle {
  return {
    id,
    slug: id,
    category: "super-lig",
    featured,
    publishedAt: "2026-09-25T09:00:00Z",
    title: { tr: `Başlık ${id}`, en: `Title ${id}` },
    summary: { tr: "Özet", en: "Summary" },
    body: { tr: ["Paragraf."], en: ["Paragraph."] },
    coverImage: { tr: "/img/haberler/varsayilan.svg", en: "/img/haberler/en/varsayilan.svg" },
    coverImageAlt: { tr: "Temsili görsel", en: "Illustrative image" },
  };
}

describe("buildHomeFeed", () => {
  it("returns nulls/empty arrays for an empty list", () => {
    expect(buildHomeFeed([])).toEqual({ hero: null, sideList: [], gridList: [] });
  });

  it("uses the first article as hero when none is featured", () => {
    const articles = [makeArticle("a"), makeArticle("b"), makeArticle("c")];
    const feed = buildHomeFeed(articles);
    expect(feed.hero?.id).toBe("a");
    expect(feed.sideList.map((a) => a.id)).toEqual(["b", "c"]);
    expect(feed.gridList).toEqual([]);
  });

  it("bubbles the featured article to hero without reordering the rest", () => {
    const articles = [
      makeArticle("a"),
      makeArticle("b"),
      makeArticle("c", true), // manset: true, 3. sırada
      makeArticle("d"),
    ];
    const feed = buildHomeFeed(articles);
    expect(feed.hero?.id).toBe("c");
    // "c" öne çıktı ama a, b, d kendi aralarındaki sırayı korudu.
    expect(feed.sideList.map((a) => a.id)).toEqual(["a", "b", "d"]);
  });

  it("keeps hero in place when it is already first", () => {
    const articles = [makeArticle("a", true), makeArticle("b"), makeArticle("c")];
    const feed = buildHomeFeed(articles);
    expect(feed.hero?.id).toBe("a");
    expect(feed.sideList.map((a) => a.id)).toEqual(["b", "c"]);
  });

  it("splits side list (max 5) and grid list (rest) correctly", () => {
    const articles = Array.from({ length: 10 }, (_, i) => makeArticle(`n${i}`));
    const feed = buildHomeFeed(articles);
    expect(feed.hero?.id).toBe("n0");
    expect(feed.sideList).toHaveLength(5);
    expect(feed.sideList.map((a) => a.id)).toEqual(["n1", "n2", "n3", "n4", "n5"]);
    expect(feed.gridList.map((a) => a.id)).toEqual(["n6", "n7", "n8", "n9"]);
  });
});
