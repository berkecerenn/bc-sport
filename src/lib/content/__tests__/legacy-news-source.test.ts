import { describe, expect, it, vi } from "vitest";
import { loadLegacyNews } from "../sources/legacy-news-source";

describe("loadLegacyNews", () => {
  it("skips invalid records and logs a warning instead of throwing", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const fakeFile = {
      guncelleme: "2026-09-25T00:00:00Z",
      haberler: [
        {
          id: "gecerli-haber",
          kategori: "super-lig",
          manset: true,
          tarih: "2026-09-25T09:00:00Z",
          baslik: { tr: "Geçerli başlık", en: "Valid title" },
          ozet: { tr: "Geçerli özet", en: "Valid summary" },
          govde: { tr: ["Paragraf."], en: ["Paragraph."] },
        },
        {
          // eksik `en` başlık alanı -> geçersiz
          id: "eksik-en-baslik",
          kategori: "super-lig",
          tarih: "2026-09-24T09:00:00Z",
          baslik: { tr: "Sadece Türkçe" },
          ozet: { tr: "Özet", en: "Summary" },
          govde: { tr: ["Paragraf."], en: ["Paragraph."] },
        },
        {
          // geçersiz tarih formatı -> geçersiz
          id: "hatali-tarih",
          kategori: "super-lig",
          tarih: "25 Eylül 2026",
          baslik: { tr: "Başlık", en: "Title" },
          ozet: { tr: "Özet", en: "Summary" },
          govde: { tr: ["Paragraf."], en: ["Paragraph."] },
        },
        {
          // boş govde dizisi -> geçersiz
          id: "bos-govde",
          kategori: "super-lig",
          tarih: "2026-09-23T09:00:00Z",
          baslik: { tr: "Başlık", en: "Title" },
          ozet: { tr: "Özet", en: "Summary" },
          govde: { tr: [], en: [] },
        },
      ],
    };

    const articles = loadLegacyNews(fakeFile);

    expect(articles).toHaveLength(1);
    expect(articles[0].slug).toBe("gecerli-haber");
    // 3 geçersiz kayıt için 3 ayrı uyarı loglanmalı.
    expect(warnSpy).toHaveBeenCalledTimes(3);

    warnSpy.mockRestore();
  });

  it("returns an empty array and logs an error when the file shape itself is invalid", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const articles = loadLegacyNews({ not: "the expected shape" });

    expect(articles).toEqual([]);
    expect(errorSpy).toHaveBeenCalledTimes(1);

    errorSpy.mockRestore();
  });
});
