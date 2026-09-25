import type { Locale } from "@/lib/i18n/config";
import { getCategoryLabel } from "@/lib/nav/categories";
import styles from "./CategoryTag.module.css";

type Props = {
  category: string;
  locale: Locale;
};

export function CategoryTag({ category, locale }: Props) {
  return <span className={styles.tag}>{getCategoryLabel(category, locale)}</span>;
}
