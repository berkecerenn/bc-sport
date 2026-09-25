// Üst menüdeki lig ve kategori listesi. legacy/index.html'deki .kategoriler
// menüsünün karşılığıdır; etiketler legacy/js/i18n.js'deki onaylı TR/EN
// çevirilerle birebir aynıdır. href'ler henüz `locale` öneki taşımaz; bunu
// kullanan bileşen (CategoryNav) `/${locale}${href}` şeklinde ekler.
export type NavLink = {
  slug: string;
  href: string;
  label: { tr: string; en: string };
};

export const allNewsLink: NavLink = {
  slug: "hepsi",
  href: "/",
  label: { tr: "Hepsi", en: "All" },
};

// Sırayla legacy/index.html'deki lig düğmeleriyle aynı. Her biri ileride
// `/lig/[lig]` sayfasına gidecek (bkz. CLAUDE.md > Hedef klasör yapısı, adım 6).
export const leagueLinks: NavLink[] = [
  { slug: "super-lig", href: "/lig/super-lig", label: { tr: "Süper Lig", en: "Super Lig" } },
  { slug: "premier-lig", href: "/lig/premier-lig", label: { tr: "Premier Lig", en: "Premier League" } },
  { slug: "la-liga", href: "/lig/la-liga", label: { tr: "La Liga", en: "La Liga" } },
  { slug: "serie-a", href: "/lig/serie-a", label: { tr: "Serie A", en: "Serie A" } },
  { slug: "bundesliga", href: "/lig/bundesliga", label: { tr: "Bundesliga", en: "Bundesliga" } },
  { slug: "ligue-1", href: "/lig/ligue-1", label: { tr: "Ligue 1", en: "Ligue 1" } },
  {
    slug: "sampiyonlar-ligi",
    href: "/lig/sampiyonlar-ligi",
    label: { tr: "UEFA Şampiyonlar Ligi", en: "UEFA Champions League" },
  },
  {
    slug: "avrupa-ligi",
    href: "/lig/avrupa-ligi",
    label: { tr: "UEFA Avrupa Ligi", en: "UEFA Europa League" },
  },
  {
    slug: "konferans-ligi",
    href: "/lig/konferans-ligi",
    label: { tr: "UEFA Konferans Ligi", en: "UEFA Conference League" },
  },
  { slug: "liga-portugal", href: "/lig/liga-portugal", label: { tr: "Liga Portugal", en: "Liga Portugal" } },
  { slug: "eredivisie", href: "/lig/eredivisie", label: { tr: "Eredivisie", en: "Eredivisie" } },
  {
    slug: "belcika-ligi",
    href: "/lig/belcika-ligi",
    label: { tr: "Belçika Pro Ligi", en: "Belgian Pro League" },
  },
  {
    slug: "norvec-ligi",
    href: "/lig/norvec-ligi",
    label: { tr: "Norveç Eliteserien", en: "Norwegian Eliteserien" },
  },
  {
    slug: "iskocya-ligi",
    href: "/lig/iskocya-ligi",
    label: { tr: "İskoçya Premiership", en: "Scottish Premiership" },
  },
  {
    slug: "danimarka-ligi",
    href: "/lig/danimarka-ligi",
    label: { tr: "Danimarka Superliga", en: "Danish Superliga" },
  },
];

// legacy/index.html'de hem "Transfer" kategori düğmesi hem de ayrı bir
// "Transfer tablosu" bağlantısı vardı; ikisi burada tek bağlantıya indirildi.
export const specialLinks: NavLink[] = [
  { slug: "transfer", href: "/transfer", label: { tr: "Transfer", en: "Transfers" } },
  { slug: "puan-durumu", href: "/puan-durumu", label: { tr: "Puan durumu", en: "Standings" } },
  { slug: "kose", href: "/kose", label: { tr: "Yazar köşesi", en: "Columns" } },
];

export const primaryNavLinks: NavLink[] = [allNewsLink, ...leagueLinks, ...specialLinks];
