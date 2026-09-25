import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { NewsArticle } from "@/types/news";
import styles from "./NewsImage.module.css";

type Props = {
  article: NewsArticle;
  locale: Locale;
  variant: "hero" | "card";
  sizes: string;
  priority?: boolean;
  photoCreditLabel: string;
};

// foto (gerçek, Pexels kaynaklı fotoğraf) varsa next/image ile göster ve
// altına/köşesine "Temsili görsel... Foto: <kredi>" yaz. Yoksa legacy'deki
// yedek SVG kapağı kullan -- next/image SVG'leri optimize etmediğinden
// (next.config'de dangerouslyAllowSVG gerektirir) burada düz <img> tercih
// edildi; statik, bizim ürettiğimiz bir dosya olduğu için güvenlik riski yok.
export function NewsImage({ article, locale, variant, sizes, priority, photoCreditLabel }: Props) {
  const figureClassName = variant === "hero" ? styles.figureHero : styles.figureCard;
  const alt = article.coverImageAlt[locale];

  return (
    <figure className={figureClassName}>
      {article.photo ? (
        <Image
          src={article.photo.url}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- yerel SVG kapak, next/image optimizasyonuna gerek yok.
        <img
          src={article.coverImage[locale]}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className={styles.image}
        />
      )}
      {article.photo ? (
        <figcaption className={styles.credit}>
          {photoCreditLabel} {article.photo.credit}
        </figcaption>
      ) : null}
    </figure>
  );
}
