// i18n.js: ÇOK DİLLİLİK (internationalization = "i18n": i ile n arasında 18 harf var)
//
// Fikir: Sayfadaki sabit yazıları (menü, düğme, altbilgi...) koda gömmüyoruz.
// Her yazıya bir "anahtar" veriyoruz (ör. "kat.hepsi") ve karşılığını dil sözlüğünde tutuyoruz.
// Dil değişince sözlüğü değiştirip yazıları yeniden basıyoruz.

// ============ 1) SÖZLÜKLER ============
// Yeni bir yazı eklemek istersen: iki dile de aynı anahtarla ekle.
const CEVIRILER = {
  tr: {
    "sr.baslik": "Sıradaki maçlar",
    "sr.yok": "Yakında oynanacak maç bilgisi henüz girilmedi.",
    "menu.kose": "Yazar köşesi",
    "kose.baslik": "Yazar köşesi",
    "kose.alt": "Maç analizleri ve yorumlar. Haberlerden daha uzun, saha diyagramlarıyla.",
    "kose.bos": "Henüz yayınlanmış analiz yok.",
    "video.kaynak": "Kaynak:",
    "haber.macMerkezi": "Maç merkezine git →",
    "mm.stat": "Stadyum",
    "mm.hakem": "Hakem",
    "mm.var": "VAR",
    "mm.yayin": "Yayın",
    "mm.saat": "Tarih ve saat",
    "mm.oncesi": "Maç öncesi",
    "mm.sonrasi": "Maç sonrası",
    "mm.demecler": "Teknik direktör ve oyuncu açıklamaları",
    "mm.konaklama": "Konaklama (oteller)",
    "mm.antrenman": "Antrenman ve tesis",
    "mm.videolar": "Videolar",
    "mm.kaynaklar": "Kaynaklar",
    "mm.once": "Maç öncesi",
    "mm.sonra": "Maç sonrası",
    "mm.aciklanmadi": "Henüz açıklanmadı",
    "mm.yok": "Maç bulunamadı.",
    "mm.hafta": "Hafta",
    "foto.temsili": "Temsili görsel, maçtan değildir. Foto:",
    "pd.baslik": "Puan durumu",
    "pd.takim": "Takım",
    "pd.o": "O",
    "pd.g": "G",
    "pd.b": "B",
    "pd.m": "M",
    "pd.av": "Av",
    "pd.p": "P",
    "pd.tarih": "Tablo tarihi:",
    "menu.puan": "Puan durumu",
    "tr.baslik": "Süper Lig transfer tablosu",
    "tr.oyuncu": "Oyuncu",
    "tr.tur": "Tür",
    "tr.bedel": "Bedel",
    "tr.gelen": "Gelenler",
    "tr.giden": "Gidenler",
    "tr.tur.T": "Kalıcı transfer",
    "tr.tur.K": "Kiralık",
    "tr.tur.B": "Bedelsiz",
    "tr.aciklanmadi": "Açıklanmadı",
    "tr.kiraBedeli": "Açıklanmadı",
    "tr.ozet": "{g} gelen, {c} giden",
    "menu.transferTablo": "Transfer tablosu",
    "sayfa.baslik": "BC Sport",
    "sayfa.aciklama": "Türkiye ve dünya futbolundan güncel haberler tek sayfada.",
    "site.slogan": "Türkiye ve dünya futbolundan güncel haberler",
    "kat.hepsi": "Hepsi",
    "kat.super-lig": "Süper Lig",
    "kat.premier-lig": "Premier Lig",
    "kat.la-liga": "La Liga",
    "kat.serie-a": "Serie A",
    "kat.bundesliga": "Bundesliga",
    "kat.ligue-1": "Ligue 1",
    "kat.sampiyonlar-ligi": "UEFA Şampiyonlar Ligi",
    "kat.avrupa-ligi": "UEFA Avrupa Ligi",
    "kat.konferans-ligi": "UEFA Konferans Ligi",
    "kat.liga-portugal": "Liga Portugal",
    "kat.eredivisie": "Eredivisie",
    "kat.belcika-ligi": "Belçika Pro Ligi",
    "kat.norvec-ligi": "Norveç Eliteserien",
    "kat.iskocya-ligi": "İskoçya Premiership",
    "kat.danimarka-ligi": "Danimarka Superliga",
    "kat.transfer": "Transfer",
    "pd.canliBilgi": "CANLI: tablo, şu an oynanan maçların anlık skorlarına göre hesaplandı.",
    "mesaj.yukleniyor": "Haberler yükleniyor…",
    "mesaj.bosKategori": "Bu kategoride henüz haber yok.",
    "mesaj.yuklenemedi": "Haberler yüklenemedi. Siteyi Live Server ile açmayı dene.",
    "mesaj.haberYok": "Aradığın haber bulunamadı.",
    "mesaj.haberYukleniyor": "Haber yükleniyor…",
    "alt.aciklama": "Haberler, birden çok kaynaktaki bilgiler karşılaştırılarak derlenir ve yeniden yazılır.",
    "alt.guncelleme": "Son güncelleme:",
    "haber.geri": "← Tüm haberler",
    "haber.ilgili": "Bunlar da ilgini çekebilir",
    "haber.kaynakNotu": "Bu haber, {kaynaklar} kaynaklarındaki bilgiler karşılaştırılarak derlenmiş ve yeniden yazılmıştır.",
    "dil.etiket": "Dil",
    "son.baslik": "SON DAKİKA",
    "one.baslik": "Öne çıkanlar",
    "diger.baslik": "Diğer haberler",
    "son.liste": "Son haberler",
    "mac.bitti": "MS",
    "canli.yazi": "CANLI",
    "kb.baslik": "Yazar köşesi",
    "kb.metin": "Berke Ceren'in maç analizleri, taktik çizimleri ve yorumları. Yeşil sahada çizgi oyuncularla.",
    "kb.dugme": "Köşeye git →",
    "mac.yok": "Bu ligde henüz doğrulanmış maç yok."
  },
  en: {
    "sr.baslik": "Upcoming matches",
    "sr.yok": "No upcoming fixtures have been entered yet.",
    "menu.kose": "Columns",
    "kose.baslik": "Columnist corner",
    "kose.alt": "Match analyses and opinion. Longer than news, with pitch diagrams.",
    "kose.bos": "No published analyses yet.",
    "video.kaynak": "Source:",
    "haber.macMerkezi": "Go to match centre →",
    "mm.stat": "Stadium",
    "mm.hakem": "Referee",
    "mm.var": "VAR",
    "mm.yayin": "Broadcast",
    "mm.saat": "Date and time",
    "mm.oncesi": "Preview",
    "mm.sonrasi": "Report",
    "mm.demecler": "Manager and player quotes",
    "mm.konaklama": "Accommodation (hotels)",
    "mm.antrenman": "Training and facilities",
    "mm.videolar": "Videos",
    "mm.kaynaklar": "Sources",
    "mm.once": "Pre-match",
    "mm.sonra": "Post-match",
    "mm.aciklanmadi": "Not announced yet",
    "mm.yok": "Match not found.",
    "mm.hafta": "Matchday",
    "foto.temsili": "Illustrative image, not from the match. Photo:",
    "pd.baslik": "Standings",
    "pd.takim": "Team",
    "pd.o": "P",
    "pd.g": "W",
    "pd.b": "D",
    "pd.m": "L",
    "pd.av": "GD",
    "pd.p": "Pts",
    "pd.tarih": "Table date:",
    "menu.puan": "Standings",
    "tr.baslik": "Super Lig transfer table",
    "tr.oyuncu": "Player",
    "tr.tur": "Type",
    "tr.bedel": "Fee",
    "tr.gelen": "Arrivals",
    "tr.giden": "Departures",
    "tr.tur.T": "Permanent",
    "tr.tur.K": "Loan",
    "tr.tur.B": "Free transfer",
    "tr.aciklanmadi": "Undisclosed",
    "tr.kiraBedeli": "Undisclosed",
    "tr.ozet": "{g} in, {c} out",
    "menu.transferTablo": "Transfer table",
    "sayfa.baslik": "BC Sport",
    "sayfa.aciklama": "Football news from Turkey and around the world, all in one place.",
    "site.slogan": "Football news from Turkey and around the world",
    "kat.hepsi": "All",
    "kat.super-lig": "Super Lig",
    "kat.premier-lig": "Premier League",
    "kat.la-liga": "La Liga",
    "kat.serie-a": "Serie A",
    "kat.bundesliga": "Bundesliga",
    "kat.ligue-1": "Ligue 1",
    "kat.sampiyonlar-ligi": "UEFA Champions League",
    "kat.avrupa-ligi": "UEFA Europa League",
    "kat.konferans-ligi": "UEFA Conference League",
    "kat.liga-portugal": "Liga Portugal",
    "kat.eredivisie": "Eredivisie",
    "kat.belcika-ligi": "Belgian Pro League",
    "kat.norvec-ligi": "Norwegian Eliteserien",
    "kat.iskocya-ligi": "Scottish Premiership",
    "kat.danimarka-ligi": "Danish Superliga",
    "kat.transfer": "Transfers",
    "pd.canliBilgi": "LIVE: the table is recalculated from the current scores of matches in play.",
    "mesaj.yukleniyor": "Loading news…",
    "mesaj.bosKategori": "No news in this category yet.",
    "mesaj.yuklenemedi": "Could not load the news. Try opening the site with Live Server.",
    "mesaj.haberYok": "The article you are looking for was not found.",
    "mesaj.haberYukleniyor": "Loading article…",
    "alt.aciklama": "Stories are compiled by comparing information from several sources and rewritten in our own words.",
    "alt.guncelleme": "Last updated:",
    "haber.geri": "← All news",
    "haber.ilgili": "You might also like",
    "haber.kaynakNotu": "This article was compiled by comparing information from {kaynaklar} and rewritten in our own words.",
    "dil.etiket": "Language",
    "son.baslik": "BREAKING",
    "one.baslik": "Top stories",
    "diger.baslik": "More news",
    "son.liste": "Latest news",
    "mac.bitti": "FT",
    "canli.yazi": "LIVE",
    "kb.baslik": "Columns",
    "kb.metin": "Match analyses, tactical diagrams and opinion by Berke Ceren, drawn on a green pitch.",
    "kb.dugme": "Read the columns →",
    "mac.yok": "No verified matches in this league yet."
  }
};

// ============ 2) AKTİF DİL ============
// Daha önce seçilen dil tarayıcıda saklanır (localStorage). Yoksa Türkçe açılır.
function kayitliDil() {
  try {
    const dil = localStorage.getItem("dil");
    if (dil === "tr" || dil === "en") return dil;
  } catch (hata) {
    // Bazı tarayıcı ayarlarında localStorage kapalı olabilir; sorun değil.
  }
  return null;
}

let aktifDil = kayitliDil() || "tr";

// ============ 3) ÇEVİRİ FONKSİYONLARI ============
// t("kat.hepsi") -> aktif dildeki yazıyı verir.
// t("haber.kaynakNotu", { kaynaklar: "Fanatik" }) -> {kaynaklar} yerine değer koyar.
function t(anahtar, degerler) {
  let metin = (CEVIRILER[aktifDil] && CEVIRILER[aktifDil][anahtar]) || CEVIRILER.tr[anahtar] || anahtar;
  if (degerler) {
    Object.keys(degerler).forEach(function (ad) {
      metin = metin.replace("{" + ad + "}", degerler[ad]);
    });
  }
  return metin;
}

// Haber verisindeki iki dilli alanları çözer: { tr: "...", en: "..." } -> aktif dildeki değer.
// İngilizce yoksa Türkçeye düşer.
function yerel(alan) {
  if (alan && typeof alan === "object" && !Array.isArray(alan)) {
    return alan[aktifDil] !== undefined ? alan[aktifDil] : alan.tr;
  }
  return alan;
}

// Tarih biçimi dile göre değişir (19 Eyl 16:05  /  19 Sept, 16:05)
function tarihKodu() {
  return aktifDil === "tr" ? "tr-TR" : "en-GB";
}

// ============ 4) SAYFAYI ÇEVİR ============
// HTML'de data-i18n="anahtar" yazan her elemanın içeriğini günceller.
function dilUygula() {
  document.documentElement.lang = aktifDil;

  document.querySelectorAll("[data-i18n]").forEach(function (eleman) {
    eleman.textContent = t(eleman.dataset.i18n);
  });

  document.querySelectorAll(".dil-dugme").forEach(function (dugme) {
    const secili = dugme.dataset.dil === aktifDil;
    dugme.classList.toggle("aktif", secili);
    dugme.setAttribute("aria-pressed", secili ? "true" : "false");
  });

  const secici = document.querySelector(".dil-secici");
  if (secici) secici.setAttribute("aria-label", t("dil.etiket"));
}

function dilDegistir(yeniDil) {
  if (yeniDil === aktifDil) return;
  aktifDil = yeniDil;
  try {
    localStorage.setItem("dil", yeniDil);
  } catch (hata) {
    // saklanamazsa sadece bu ziyaret için geçerli olur
  }
  dilUygula();
  // Diğer dosyalara "dil değişti" haberi veriyoruz; onlar kendi içeriğini yeniden çizer.
  document.dispatchEvent(new Event("dilDegisti"));
}

// Dil düğmelerine tıklama olayını bağla
document.querySelectorAll(".dil-dugme").forEach(function (dugme) {
  dugme.addEventListener("click", function () {
    dilDegistir(dugme.dataset.dil);
  });
});

// Sayfa ilk açıldığında da çevir
dilUygula();
