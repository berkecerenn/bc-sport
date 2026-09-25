import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { NewsArticle } from "@/types/news";
import { formatNewsDate } from "@/lib/i18n/format";
import { NewsImage } from "./NewsImage";
import { CategoryTag } from "./CategoryTag";
import styles from "./NewsCard.module.css";

type Props = {
  article: NewsArticle;
  locale: Locale;
  photoCreditLabel: string;
};

export function NewsCard({ article, locale, photoCreditLabel }: Props) {
  return (
    <Link href={`/${locale}/haber/${article.slug}`} className={styles.card}>
      <NewsImage
        article={article}
        locale={locale}
        variant="card"
        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 45vw, 300px"
        photoCreditLabel={photoCreditLabel}
      />
      <div className={styles.body}>
        <CategoryTag category={article.category} locale={locale} />
        <h3 className={styles.title}>{article.title[locale]}</h3>
        <p className={styles.summary}>{article.summary[locale]}</p>
        <p className={styles.date}>{formatNewsDate(article.publishedAt, locale)}</p>
      </div>
    </Link>
  );
}
