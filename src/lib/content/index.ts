import { createJsonContentRepository } from "./sources/json-source";

export type { ContentRepository } from "./repository";

// Şu an tek kaynak JSON'dır. Supabase kaynağı eklendiğinde (adım 8) burada
// ortam değişkenine göre seçim yapılacak; sayfalar bu export'u değiştirmeden kullanmaya devam eder.
export const contentRepository = createJsonContentRepository();
