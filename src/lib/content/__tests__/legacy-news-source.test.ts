import { describe, expect, it, vi } from "vitest";
import { loadLegacyNews } from "../sources/legacy-news-source";

describe("loadLegacyNews", () => {
  it("maps gorsel/gorselAlt/foto to coverImage/coverImageAlt/photo", () => {
    const fakeFile = {
      guncelleme: "2026-09-25T00:00:00Z",
      haberler: [
        {
          id: "fotografli-haber",
          kategori: "super-lig",
          manset: true,
          tarih: "2026-09-25T09:00:00Z",
          baslik: { tr: "Fotoğraflı haber", en: "Article with a photo" },
          ozet: { tr: "Özet", en: "Summary" },
          govde: { tr: ["Paragraf."], en: ["Paragraph."] },
          gorsel: { tr: "img/haberler/varsayilan.svg", en: "img/haberler/en/varsayilan.svg" },
          gorselAlt: { tr: "Temsili görsel", en: "Illustrative image" },
          foto: {
            url: "https://images.pexels.com/photos/1/pexels-photo-1.jpeg",
            kredi: "Ada Fotoğrafçı / Pexels",
            kaynakUrl: "https://www.pexels.com/photo/1/",
          },
        },
        {
          id: "fotografsiz-haber",
          kategori: "super-lig",
          tarih: "2026-09-24T09:00:00Z",
          baslik: { tr: "Fotoğrafsız haber", en: "Article without a photo" },
          ozet: { tr: "Özet", en: "Summary" },
          govde: { tr: ["Paragraf."], en: ["Paragraph."] },
          gorsel: { tr: "img/haberler/varsayilan.svg", en: "img/haberler/en/varsayilan.svg" },
          gorselAlt: { tr: "Temsili görsel", en: "Illustrative image" },
        },
      ],
    };

    const articles = loadLegacyNews(fakeFile);

    expect(articles).toHaveLength(2);

    const withPhoto = articles.find((a) => a.slug === "fotografli-haber");
    expect(withPhoto?.coverImage).toEqual({
      tr: "/img/haberler/varsayilan.svg",
      en: "/img/haberler/en/varsayilan.svg",
    });
    expect(withPhoto?.photo).toEqual({
      url: "https://images.pexels.com/photos/1/pexels-photo-1.jpeg",
      credit: "Ada Fotoğrafçı / Pexels",
      sourceUrl: "https://www.pexels.com/photo/1/",
    });

    const withoutPhoto = articles.find((a) => a.slug === "fotografsiz-haber");
    expect(withoutPhoto?.photo).toBeUndefined();
    expect(withoutPhoto?.coverImageAlt.tr).toBe("Temsili görsel");
  });

  it("skips invalid records and logs a warning instead of throwing", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const gorsel = { tr: "img/haberler/varsayilan.svg", en: "img/haberler/en/varsayilan.svg" };
    const gorselAlt = { tr: "Temsili görsel", en: "Illustrative image" };

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
          gorsel,
          gorselAlt,
        },
        {
          // eksik `en` başlık alanı -> geçersiz
          id: "eksik-en-baslik",
          kategori: "super-lig",
          tarih: "2026-09-24T09:00:00Z",
          baslik: { tr: "Sadece Türkçe" },
          ozet: { tr: "Özet", en: "Summary" },
          govde: { tr: ["Paragraf."], en: ["Paragraph."] },
          gorsel,
          gorselAlt,
        },
        {
          // geçersiz tarih formatı -> geçersiz
          id: "hatali-tarih",
          kategori: "super-lig",
          tarih: "25 Eylül 2026",
          baslik: { tr: "Başlık", en: "Title" },
          ozet: { tr: "Özet", en: "Summary" },
          govde: { tr: ["Paragraf."], en: ["Paragraph."] },
          gorsel,
          gorselAlt,
        },
        {
          // gorsel alanı eksik -> geçersiz
          id: "gorsel-eksik",
          kategori: "super-lig",
          tarih: "2026-09-23T09:00:00Z",
          baslik: { tr: "Başlık", en: "Title" },
          ozet: { tr: "Özet", en: "Summary" },
          govde: { tr: ["Paragraf."], en: ["Paragraph."] },
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
