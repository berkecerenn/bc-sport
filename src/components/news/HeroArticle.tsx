import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { NewsArticle } from "@/types/news";
import { NewsImage } from "./NewsImage";
import { CategoryTag } from "./CategoryTag";
import styles from "./HeroArticle.module.css";

type Props = {
  article: NewsArticle;
  locale: Locale;
  photoCreditLabel: string;
};

export function HeroArticle({ article, locale, photoCreditLabel }: Props) {
  return (
    <Link href={`/${locale}/haber/${article.slug}`} className={styles.hero}>
      <NewsImage
        article={article}
        locale={locale}
        variant="hero"
        sizes="(max-width: 900px) 100vw, 700px"
        priority
        photoCreditLabel={photoCreditLabel}
      />
      <div className={styles.overlay}>
        <CategoryTag category={article.category} locale={locale} />
        <h2 className={styles.title}>{article.title[locale]}</h2>
        <p className={styles.summary}>{article.summary[locale]}</p>
      </div>
    </Link>
  );
}
