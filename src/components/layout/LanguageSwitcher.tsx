"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import styles from "./LanguageSwitcher.module.css";

type Props = {
  currentLocale: Locale;
  label: string;
};

// Dil değiştiğinde locale önekini değiştirip yolun geri kalanını korur:
// /tr/haber/x -> /en/haber/x.
export function LanguageSwitcher({ currentLocale, label }: Props) {
  const pathname = usePathname() ?? `/${currentLocale}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className={styles.switcher} role="group" aria-label={label}>
      {locales.map((locale) => {
        const href = `/${locale}${rest ? `/${rest}` : ""}`;
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={isActive ? `${styles.button} ${styles.active}` : styles.button}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
