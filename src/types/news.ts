import { z } from "zod";

// İki dilli (TR/EN) metin alanları için ortak şema.
export const localizedTextSchema = z.object({
  tr: z.string().min(1),
  en: z.string().min(1),
});

export const localizedParagraphsSchema = z.object({
  tr: z.array(z.string().min(1)).min(1),
  en: z.array(z.string().min(1)).min(1),
});

// Telif açısından serbest (Pexels/Unsplash) gerçek fotoğraf; her zaman
// temsilidir (maçtan değildir) ve kredi zorunludur (bkz. legacy/DATA-KURALLARI.md).
export const newsPhotoSchema = z.object({
  url: z.string().url(),
  credit: z.string().min(1),
  sourceUrl: z.string().url(),
});

export const newsArticleSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime(),
  title: localizedTextSchema,
  summary: localizedTextSchema,
  body: localizedParagraphsSchema,
  // Her haberde bulunan yedek SVG kapak (gerçek fotoğraf yoksa bu gösterilir).
  coverImage: localizedTextSchema,
  coverImageAlt: localizedTextSchema,
  // Yalnızca bazı haberlerde bulunur; varsa kapağın yerine gösterilir.
  photo: newsPhotoSchema.optional(),
});

export type LocalizedText = z.infer<typeof localizedTextSchema>;
export type LocalizedParagraphs = z.infer<typeof localizedParagraphsSchema>;
export type NewsPhoto = z.infer<typeof newsPhotoSchema>;
export type NewsArticle = z.infer<typeof newsArticleSchema>;
