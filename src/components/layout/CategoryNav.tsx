"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { primaryNavLinks } from "@/lib/nav/categories";
import { Container } from "@/components/ui/Container";
import styles from "./CategoryNav.module.css";

type Props = {
  locale: Locale;
  categoriesLabel: string;
  openLabel: string;
  closeLabel: string;
};

const LIST_ID = "kategori-listesi";

// Mobil açılır/kapanır menü native <details>/<summary> ile kurulu: açma/kapama
// tamamen HTML'in kendi davranışı, JavaScript'e bağlı değil. Bunu bilinçli
// seçtik çünkü bir hydration uyuşmazlığı (ör. bir tarayıcı eklentisinin DOM'a
// erken müdahalesi) veya JS'in henüz hazır olmadığı bir an, React state'ine
// bağlı bir onClick'in hiçbir şey yapmamasına yol açabiliyordu; native
// <details> bu sınıftaki hataların tamamını ortadan kaldırıyor. React/JS
// yalnızca ek kolaylıklar için var: Escape ile kapatma, dışarı tıklayınca
// kapatma, sayfa değişince kapatma. Bkz. e2e/category-nav.spec.ts.
export function CategoryNav({ locale, categoriesLabel, openLabel, closeLabel }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Sayfa değişince menüyü kapat (dış sistemle -pathname ile- senkronizasyon,
  // bu yüzden effect içinde; setState değil, DOM özelliği güncelleniyor).
  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    function close() {
      if (details) details.open = false;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && details?.open) close();
    }
    function handlePointerDown(event: MouseEvent) {
      if (details?.open && !details.contains(event.target as Node)) close();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <Container className={styles.inner}>
        <details className={styles.details} ref={detailsRef}>
          <summary className={styles.toggle} aria-controls={LIST_ID}>
            <span aria-hidden="true" className={`${styles.icon} ${styles.iconClosed}`}>
              ☰
            </span>
            <span aria-hidden="true" className={`${styles.icon} ${styles.iconOpen}`}>
              ✕
            </span>
            <span className={styles.labelClosed}>{openLabel}</span>
            <span className={styles.labelOpen}>{closeLabel}</span>
          </summary>
        </details>
        <nav aria-label={categoriesLabel} className={styles.nav}>
          <ul id={LIST_ID} className={styles.list}>
            {primaryNavLinks.map((item) => {
              const href = `/${locale}${item.href === "/" ? "" : item.href}`;
              const isActive = pathname === href;

              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={isActive ? `${styles.link} ${styles.active}` : styles.link}
                  >
                    {item.label[locale]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
