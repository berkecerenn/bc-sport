import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container } from "@/components/ui/Container";
import "../globals.css";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);
  return {
    title: dict.site.name,
    description: dict.site.tagline,
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <SkipLink label={dict.nav.skipToContent} />
        <SiteHeader locale={locale} dictionary={dict} />
        <CategoryNav
          locale={locale}
          categoriesLabel={dict.nav.categoriesLabel}
          openLabel={dict.nav.openMenu}
          closeLabel={dict.nav.closeMenu}
        />
        <main id="icerik">
          <Container>{children}</Container>
        </main>
        <SiteFooter dictionary={dict} />
      </body>
    </html>
  );
}
