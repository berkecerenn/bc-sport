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

export const newsArticleSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime(),
  title: localizedTextSchema,
  summary: localizedTextSchema,
  body: localizedParagraphsSchema,
});

export type LocalizedText = z.infer<typeof localizedTextSchema>;
export type LocalizedParagraphs = z.infer<typeof localizedParagraphsSchema>;
export type NewsArticle = z.infer<typeof newsArticleSchema>;
