import type { Locale } from "./config";

// legacy/js/ortak.js > tarihYaz() ile aynı biçim: "19 Eyl 16:05" (TR) /
// "19 Sept, 16:05" (EN). Saat dilimi bilinçli olarak sabit (Europe/Istanbul):
// veri UTC olarak saklanıyor ve sitenin birincil kitlesi Türkiye, bu yüzden
// build makinesinin yerel saat dilimi ne olursa olsun tutarlı bir çıktı
// üretmesi için açıkça belirtiyoruz.
const localeTags: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-GB",
};

export function formatNewsDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleString(localeTags[locale], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
}
