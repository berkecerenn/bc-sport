import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { NewsArticle } from "@/types/news";
import { formatNewsDate } from "@/lib/i18n/format";
import { CategoryTag } from "./CategoryTag";
import styles from "./LatestList.module.css";

type Props = {
  articles: NewsArticle[];
  locale: Locale;
  heading: string;
};

// legacy'deki yanListe ("son haberler") ile aynı: metin tabanlı, görselsiz.
export function LatestList({ articles, locale, heading }: Props) {
  if (articles.length === 0) return null;

  return (
    <aside aria-label={heading} className={styles.aside}>
      <h2 className={styles.heading}>{heading}</h2>
      <ol className={styles.list}>
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={`/${locale}/haber/${article.slug}`} className={styles.item}>
              <time className={styles.time} dateTime={article.publishedAt}>
                {formatNewsDate(article.publishedAt, locale)}
              </time>
              <span className={styles.text}>
                <CategoryTag category={article.category} locale={locale} />
                <span className={styles.title}>{article.title[locale]}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
