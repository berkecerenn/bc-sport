import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./SiteHeader.module.css";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteHeader({ locale, dictionary }: Props) {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href={`/${locale}`} className={styles.brand}>
          <Image
            src="/img/marka/logo.png"
            alt={dictionary.site.name}
            width={88}
            height={48}
            priority
          />
          <span className={styles.brandText}>
            <span className={styles.name}>{dictionary.site.name}</span>
            <span className={styles.tagline}>{dictionary.site.tagline}</span>
          </span>
        </Link>
        <LanguageSwitcher currentLocale={locale} label={dictionary.nav.languageLabel} />
      </Container>
    </header>
  );
}
