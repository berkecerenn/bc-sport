import type { Locale } from "./config";
import tr from "./dictionaries/tr.json";

export type Dictionary = typeof tr;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  tr: () => import("./dictionaries/tr.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
