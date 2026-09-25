import { z } from "zod";
import {
  localizedParagraphsSchema,
  localizedTextSchema,
  newsArticleSchema,
  type NewsArticle,
} from "@/types/news";
import rawLegacyFile from "../../../../legacy/data/haberler.json";

// legacy'deki foto{url,kredi,kaynakUrl} alanı (bkz. legacy/DATA-KURALLARI.md #6-7).
const legacyPhotoSchema = z.object({
  url: z.string().url(),
  kredi: z.string().min(1),
  kaynakUrl: z.string().url(),
});

// legacy/data/haberler.json referans amaçlıdır ve Supabase'e taşınana kadar
// (bkz. CLAUDE.md > Geliştirme sırası, adım 8) doğrudan bu dosyadan okunur.
// Alan adları Türkçedir; `id` zaten kebab-case ve tekil olduğu için slug olarak
// da kullanılır. `fotoAra` (Wikipedia/Commons arama adayları) BİLİNÇLİ OLARAK
// taşınmıyor: legacy sitedeki dinamik/istemci-taraflı fotoğraf arama özelliğini
// tekrar etmiyoruz (bkz. "sunucu bileşeni, minimum istemci JS" ilkesi). Diğer
// bilinmeyen/fazladan alanlar (kaynaklar, macId...) da bu şemada tanımlı
// olmadığından zod tarafından otomatik olarak yok sayılır (strip).
const legacyNewsItemSchema = z
  .object({
    id: z.string().min(1),
    kategori: z.string().min(1),
    manset: z.boolean().optional(),
    tarih: z.string().datetime(),
    baslik: localizedTextSchema,
    ozet: localizedTextSchema,
    govde: localizedParagraphsSchema,
    gorsel: localizedTextSchema,
    gorselAlt: localizedTextSchema,
    foto: legacyPhotoSchema.optional(),
  })
  .transform(
    (raw): NewsArticle => ({
      id: raw.id,
      slug: raw.id,
      category: raw.kategori,
      featured: raw.manset ?? false,
      publishedAt: raw.tarih,
      title: raw.baslik,
      summary: raw.ozet,
      body: raw.govde,
      // legacy'deki gorsel yolları site köküne göre bağıl (ör. "img/haberler/varsayilan.svg");
      // public/ altına aynı yapıda kopyalandılar, bu yüzden başına "/" ekleyip mutlak yapıyoruz.
      coverImage: { tr: `/${raw.gorsel.tr}`, en: `/${raw.gorsel.en}` },
      coverImageAlt: raw.gorselAlt,
      photo: raw.foto
        ? { url: raw.foto.url, credit: raw.foto.kredi, sourceUrl: raw.foto.kaynakUrl }
        : undefined,
    }),
  );

const legacyNewsFileSchema = z.object({
  guncelleme: z.string().optional(),
  haberler: z.array(z.unknown()),
});

function describeIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "(kök)"}: ${issue.message}`)
    .join("; ");
}

/**
 * legacy/data/haberler.json içeriğini okuyup doğrular ve NewsArticle[] döner.
 * Geçersiz kayıtlar atlanır ve `console.warn` ile loglanır; site build'ini kırmazlar.
 * `file` parametresi test amaçlıdır (gerçek dosya yerine sahte veri geçilebilir).
 */
export function loadLegacyNews(file: unknown = rawLegacyFile): NewsArticle[] {
  const parsedFile = legacyNewsFileSchema.safeParse(file);
  if (!parsedFile.success) {
    console.error(
      "[content] legacy/data/haberler.json beklenen dosya şemasına uymuyor:",
      describeIssues(parsedFile.error),
    );
    return [];
  }

  const articles: NewsArticle[] = [];

  parsedFile.data.haberler.forEach((rawItem, index) => {
    const result = legacyNewsItemSchema.safeParse(rawItem);
    if (!result.success) {
      const id =
        typeof rawItem === "object" && rawItem !== null && "id" in rawItem
          ? String((rawItem as { id: unknown }).id)
          : undefined;
      console.warn(
        `[content] legacy haber atlandı (index ${index}${id ? `, id: ${id}` : ""}): ${describeIssues(
          result.error,
        )}`,
      );
      return;
    }

    // Dönüşüm sonrası son bir kez paylaşılan NewsArticle şemasına karşı da doğrula.
    const validated = newsArticleSchema.safeParse(result.data);
    if (!validated.success) {
      console.warn(
        `[content] legacy haber NewsArticle şemasına uymuyor (index ${index}, id: ${result.data.id}): ${describeIssues(
          validated.error,
        )}`,
      );
      return;
    }

    articles.push(validated.data);
  });

  return articles;
}
