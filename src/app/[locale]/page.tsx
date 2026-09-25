import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { contentRepository } from "@/lib/content";
import { buildHomeFeed } from "@/lib/content/home-feed";
import { HeroArticle } from "@/components/news/HeroArticle";
import { LatestList } from "@/components/news/LatestList";
import { NewsCard } from "@/components/news/NewsCard";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const articles = await contentRepository.getAllNews();
  const { hero, sideList, gridList } = buildHomeFeed(articles);

  if (!hero) {
    return <p>{dict.news.empty}</p>;
  }

  const photoCreditLabel = dict.news.photoCredit;

  return (
    <div className={styles.page}>
      <section className={styles.top}>
        <HeroArticle article={hero} locale={locale} photoCreditLabel={photoCreditLabel} />
        <LatestList articles={sideList} locale={locale} heading={dict.news.latestHeading} />
      </section>

      {gridList.length > 0 && (
        <section>
          <h2 className={styles.gridHeading}>{dict.news.moreHeading}</h2>
          <div className={styles.grid}>
            {gridList.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                locale={locale}
                photoCreditLabel={photoCreditLabel}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
