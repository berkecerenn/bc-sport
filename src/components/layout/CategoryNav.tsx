"use client";

import { useEffect, useRef, useState } from "react";
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

// Masaüstünde legacy'deki gibi yatay kaydırmalı hap menü; mobilde (≤800px)
// düğmeyle açılıp kapanan açılır menü.
export function CategoryNav({ locale, categoriesLabel, openLabel, closeLabel }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sayfa değiştiğinde mobil menüyü kapat. Bunu bir effect yerine render
  // sırasında yapıyoruz (React'ın "adjusting state during render" deseni:
  // https://react.dev/learn/you-might-not-need-an-effect), çünkü effect
  // içinde senkron setState çağrısı gereksiz bir ekstra render'a yol açar.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Açıkken Escape veya dışarı tıklama ile kapat.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Container className={styles.inner}>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={LIST_ID}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" className={styles.toggleIcon}>
            {open ? "✕" : "☰"}
          </span>
          {open ? closeLabel : openLabel}
        </button>
        <nav aria-label={categoriesLabel} className={styles.nav}>
          <ul id={LIST_ID} className={open ? `${styles.list} ${styles.open}` : styles.list}>
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
