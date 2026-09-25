import { z } from "zod";
import {
  localizedParagraphsSchema,
  localizedTextSchema,
  newsArticleSchema,
  type NewsArticle,
} from "@/types/news";
import rawLegacyFile from "../../../../legacy/data/haberler.json";

// legacy/data/haberler.json referans amaçlıdır ve Supabase'e taşınana kadar
// (bkz. CLAUDE.md > Geliştirme sırası, adım 8) doğrudan bu dosyadan okunur.
// Alan adları Türkçedir; `id` zaten kebab-case ve tekil olduğu için slug olarak
// da kullanılır. Bilinmeyen/fazladan alanlar (gorsel, kaynaklar, macId, fotoAra...)
// bu şemada tanımlı olmadığından zod tarafından otomatik olarak yok sayılır (strip).
const legacyNewsItemSchema = z
  .object({
    id: z.string().min(1),
    kategori: z.string().min(1),
    manset: z.boolean().optional(),
    tarih: z.string().datetime(),
    baslik: localizedTextSchema,
    ozet: localizedTextSchema,
    govde: localizedParagraphsSchema,
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
