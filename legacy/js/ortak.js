// ortak.js: hem ana sayfanın hem haber sayfasının kullandığı ortak parçalar.
// (i18n.js dosyasındaki t(), yerel() ve tarihKodu() fonksiyonlarını kullanır.)

// Kategori kodunun aktif dildeki adı: "super-lig" -> "Süper Lig" / "Super Lig"
function kategoriAdi(kod) {
  const anahtar = "kat." + kod;
  const ad = t(anahtar);
  return ad === anahtar ? "Futbol" : ad; // sözlükte yoksa yedek ad
}

// "2026-09-19T13:05:00Z" -> "19 Eyl 16:05" (Türkçe) veya "19 Sept, 16:05" (İngilizce)
function tarihYaz(tarihMetni) {
  const tarih = new Date(tarihMetni);
  return tarih.toLocaleString(tarihKodu(), {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// haberler.json dosyasını indirir ve yeniden eskiye sıralar
async function haberVerisiniAl() {
  const cevap = await fetch("data/haberler.json");
  if (!cevap.ok) {
    throw new Error("haberler.json bulunamadı");
  }
  const veri = await cevap.json();
  veri.haberler.sort(function (a, b) {
    return new Date(b.tarih) - new Date(a.tarih);
  });
  return veri;
}

// Kapak: haberde "foto" varsa gerçek fotoğrafı göster; yüklenemezse kendi tasarım kapağımıza (SVG) dön.
function fotoBagla(resim, haber, krediKutusu) {
  const yedek = yerel(haber.gorsel);
  const yedegeDon = function () {
    resim.classList.remove("foto-gercek");
    if (krediKutusu) krediKutusu.textContent = "";
    if (yedek) resim.src = yedek;
  };
  const yukle = function (foto) {
    resim.referrerPolicy = "no-referrer";
    resim.addEventListener("error", yedegeDon, { once: true });
    resim.classList.add("foto-gercek");
    resim.src = foto.url;
    if (krediKutusu && foto.kredi) krediKutusu.textContent = t("foto.temsili") + " " + foto.kredi;
  };
  if (yedek) resim.src = yedek;   // önce hafif kapak; gerçek fotoğraf gelince değişir
  if (haber.fotoAra && haber.fotoAra.length) {
    wikiFoto([].concat(haber.fotoAra)).then(function (f) { if (f) yukle(f); else if (haber.foto && haber.foto.url) yukle(haber.foto); });
  } else if (haber.foto && haber.foto.url) {
    yukle(haber.foto);
  }
}

// Fotoğraf kredisi satırı (fotoğraf yüklenince doldurulur)
function fotoKredisi(haber) {
  const p = document.createElement("p");
  p.className = "foto-kredi";
  if (haber.foto && haber.foto.kredi && !haber.fotoAra) p.textContent = t("foto.temsili") + " " + haber.foto.kredi;
  return p;
}

// ---- Takım armaları ----
// Logo dosyalarını sen koyarsın: img/logolar/<takim-adi-slug>.png (ör. galatasaray.png, manchester-city.png).
// Dosya yoksa kısa kod rozeti görünür; site bozulmaz.
function slugla(ad) {
  return String(ad).toLowerCase()
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function armaOlustur(takim, buyuk) {
  const kutu = document.createElement("span");
  kutu.className = "arma" + (buyuk ? " buyuk" : "");
  const kod = (takim.kod || takim.ad).slice(0, 3);
  const resim = document.createElement("img");
  resim.alt = "";
  resim.loading = "lazy";
  const yedegeDon = function () { resim.remove(); kutu.classList.add("yedek"); kutu.textContent = kod; };
  // 1) senin koyduğun yerel dosya, 2) Wikipedia'dan gerçek arma, 3) kod rozeti
  resim.addEventListener("error", function () {
    resim.style.visibility = "hidden";
    resim.addEventListener("load", function () { resim.style.visibility = "visible"; }, { once: true });
    armaAra(takim.ad).then(function (u) {
      if (!u) { yedegeDon(); return; }
      resim.addEventListener("error", yedegeDon, { once: true });
      resim.src = u;
    });
  }, { once: true });
  resim.src = takim.logo || ("img/logolar/" + slugla(takim.ad) + ".png");
  kutu.append(resim);
  return kutu;
}

// ---- Lig teması ----
const LIG_BILGI = {
  "super-lig": { ad: "Trendyol Süper Lig", not: "Türkiye" },
  "premier-lig": { ad: "Premier League", not: "England" },
  "la-liga": { ad: "LALIGA EA SPORTS", not: "España" },
  "serie-a": { ad: "Serie A", not: "Italia" },
  "bundesliga": { ad: "Bundesliga", not: "Deutschland" },
  "ligue-1": { ad: "Ligue 1", not: "France" },
  "sampiyonlar-ligi": { ad: "UEFA Champions League", not: "UEFA" },
  "avrupa-ligi": { ad: "UEFA Europa League", not: "UEFA" },
  "konferans-ligi": { ad: "UEFA Conference League", not: "UEFA" },
  "liga-portugal": { ad: "Liga Portugal Betclic", not: "Portugal" },
  "eredivisie": { ad: "Eredivisie", not: "Nederland" },
  "belcika-ligi": { ad: "Jupiler Pro League", not: "België" },
  "norvec-ligi": { ad: "Eliteserien", not: "Norge" },
  "iskocya-ligi": { ad: "Scottish Premiership", not: "Scotland" },
  "danimarka-ligi": { ad: "Danish Superliga", not: "Danmark" }
};
function temaUygula(kod) {
  const bilgi = LIG_BILGI[kod];
  if (bilgi) document.body.dataset.tema = kod; else delete document.body.dataset.tema;
  const bant = document.getElementById("ligBandi");
  if (!bant) return;
  bant.textContent = "";
  if (!bilgi) return;
  const kap = document.createElement("div");
  kap.className = "kapsayici";
  const kutu = document.createElement("div");
  kutu.className = "lig-logo-kutu";
  const img = document.createElement("img");
  img.alt = bilgi.ad;
  const ligYedek = function () { img.remove(); const s = document.createElement("span"); s.textContent = bilgi.ad.slice(0, 3).toUpperCase(); kutu.append(s); };
  img.addEventListener("error", function () {
    wikiLogo(LIG_ARAMA[kod] || bilgi.ad).then(function (u) {
      if (!u) { ligYedek(); return; }
      img.addEventListener("error", ligYedek, { once: true });
      img.src = u;
    });
  }, { once: true });
  img.src = "img/ligler/" + kod + ".png";
  kutu.append(img);
  const yazi = document.createElement("div");
  const h = document.createElement("h2"); h.textContent = bilgi.ad;
  const p = document.createElement("p"); p.textContent = bilgi.not;
  yazi.append(h, p);
  kap.append(kutu, yazi);
  bant.append(kap);
}

// Menüdeki her lig düğmesinin başına küçük gerçek lig/kupa logosu (yerel dosya yoksa Wikipedia'dan).
function ligIkonuEkle(dugme, kod) {
  const bilgi = LIG_BILGI[kod];
  if (!bilgi || dugme.querySelector(".kat-ikon")) return;
  const img = document.createElement("img");
  img.className = "kat-ikon";
  img.alt = "";
  // Menü her zaman görünür olduğundan "lazy" burada gecikmeye yol açabiliyor; eager yükleniyor.
  const yedek = function () { img.remove(); };
  img.addEventListener("error", function () {
    wikiLogo(LIG_ARAMA[kod] || bilgi.ad).then(function (u) {
      if (!u) { yedek(); return; }
      img.addEventListener("error", yedek, { once: true });
      img.src = u;
    });
  }, { once: true });
  img.src = "img/ligler/" + kod + ".png";
  dugme.prepend(img);
}
function menuIkonlariEkle(kapsayici) {
  (kapsayici || document).querySelectorAll("[data-kategori]").forEach(function (d) {
    const kod = d.dataset.kategori;
    if (kod && LIG_BILGI[kod]) ligIkonuEkle(d, kod);
  });
}
document.addEventListener("DOMContentLoaded", function () { menuIkonlariEkle(document); });
document.addEventListener("dilDegisti", function () { menuIkonlariEkle(document); });


// Haber/analiz içi video: {youtube:"VIDEO_ID", baslik, kaynak}  veya  {mp4:"yol", baslik}
function videoOlustur(v) {
  const fig = document.createElement("figure");
  fig.className = "video-kutu";
  const cer = document.createElement("div");
  cer.className = "cerceve";
  const yid = youtubeId(v);
  if (yid) {
    const f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(yid);
    f.title = v.baslik || "Video";
    f.loading = "lazy";
    f.allow = "accelerometer; encrypted-media; picture-in-picture";
    f.allowFullscreen = true;
    cer.append(f);
  } else if (v.mp4) {
    const vd = document.createElement("video");
    vd.src = v.mp4; vd.controls = true; vd.preload = "metadata";
    vd.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
    cer.append(vd);
  }
  fig.append(cer);
  const c = document.createElement("figcaption");
  c.textContent = (v.baslik || "") + (v.kaynak ? " · " + t("video.kaynak") + " " + v.kaynak : "");
  fig.append(c);
  return fig;
}


// ---- Alt sayfalardaki menü (ana sayfadaki ile aynı bölümler) ----
function menuCiz() {
  const kap = document.getElementById("ustMenu");
  if (!kap) return;
  kap.textContent = "";
  const ana = document.createElement("div");
  ana.className = "ana-menu";
  const nav = document.createElement("nav");
  nav.className = "kategoriler kapsayici";
  const ekle = function (href, metin, sinif, kod) {
    const a = document.createElement("a");
    a.className = "kat-dugme " + (sinif || "");
    a.href = href; a.textContent = metin;
    nav.append(a);
    if (kod) ligIkonuEkle(a, kod);
    return a;
  };
  ekle("index.html", t("kat.hepsi"));
  ["super-lig", "premier-lig", "la-liga", "serie-a", "bundesliga", "ligue-1", "sampiyonlar-ligi", "avrupa-ligi", "konferans-ligi", "liga-portugal", "eredivisie", "belcika-ligi", "norvec-ligi", "iskocya-ligi", "danimarka-ligi"].forEach(function (k) {
    ekle("index.html?lig=" + k, t("kat." + k), "", k);
  });
  ekle("puan-durumu.html", t("menu.puan"), "ozel");
  ekle("transfer.html", t("menu.transferTablo"), "ozel");
  ekle("kose.html", t("menu.kose"), "ozel kose");
  ana.append(nav);
  kap.append(ana);
}
document.addEventListener("DOMContentLoaded", menuCiz);
document.addEventListener("dilDegisti", menuCiz);

// ---- Video: tam YouTube bağlantısı da yapıştırılabilir ----
function youtubeId(v) {
  if (v.youtube) return v.youtube;
  if (!v.url) return null;
  const m = String(v.url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}


// ============ WIKIPEDIA'DAN GERÇEK LOGO VE FOTOĞRAF (tarayıcın doğrudan çeker, önbelleğe alır) ============
const WIKI_API = "https://en.wikipedia.org/w/api.php";
const LOGO_ARAMA = {   // arama metnini elle düzeltmek istediğin takımlar: "Site adı": "Wikipedia'da aranacak metin"
  "Amed SK": "Amedspor", "Amed SF": "Amedspor", "Amedspor": "Amedspor", "Çorum FK": "Çorum F.K.", "Gaziantep FK": "Gaziantep F.K.",
  "Kocaelispor": "Kocaelispor", "Erzurumspor FK": "Erzurumspor FK", "Eyüpspor": "Eyüpspor", "Rizespor": "Çaykur Rizespor", "Çaykur Rizespor": "Çaykur Rizespor",
  "Man. City": "Manchester City F.C.", "Man. United": "Manchester United F.C.", "Tottenham": "Tottenham Hotspur F.C.", "Brighton": "Brighton & Hove Albion F.C.",
  "Bayern München": "FC Bayern Munich", "Bayern Münih": "FC Bayern Munich", "Gladbach": "Borussia Mönchengladbach", "Elversberg": "SV Elversberg",
  "Inter": "Inter Milan", "Milan": "AC Milan", "Marsilya": "Olympique de Marseille", "Marseille": "Olympique de Marseille", "Paris SG": "Paris Saint-Germain F.C.", "Lyon": "Olympique Lyonnais",
  "Monaco": "AS Monaco FC", "Lille": "Lille OSC", "Rennes": "Stade Rennais F.C.", "Nice": "OGC Nice", "Lens": "RC Lens", "Real Betis": "Real Betis", "Alavés": "Deportivo Alavés",
  "Sporting CP": "Sporting CP", "Porto": "FC Porto", "Benfica": "S.L. Benfica", "Braga": "S.C. Braga", "Ajax": "AFC Ajax", "PSV": "PSV Eindhoven", "Feyenoord": "Feyenoord", "AZ": "AZ Alkmaar", "Twente": "FC Twente", "Rangers": "Rangers F.C.", "Hearts": "Heart of Midlothian F.C.", "Union SG": "Royal Union Saint-Gilloise", "Anderlecht": "R.S.C. Anderlecht", "Club Brugge": "Club Brugge KV", "Genk": "K.R.C. Genk", "Bodø/Glimt": "FK Bodø/Glimt", "Brann": "SK Brann", "København": "F.C. Copenhagen", "Midtjylland": "FC Midtjylland", "Brøndby": "Brøndby IF", "Celtic": "Celtic F.C.", "Salzburg": "FC Red Bull Salzburg", "Slavia Prague": "SK Slavia Prague", "Sparta Prague": "AC Sparta Prague",
  "OB": "Odense Boldklub", "Nordsjælland": "FC Nordsjælland", "Vejle": "Vejle Boldklub", "Silkeborg": "Silkeborg IF", "Randers": "Randers FC", "AGF": "AGF Aarhus", "Viborg": "Viborg FF", "Sønderjyske": "SønderjyskE",
  "ADO Den Haag": "ADO Den Haag", "Levski Sofia": "PFC Levski Sofia", "Kızılyıldız": "Red Star Belgrade"
};
const LIG_ARAMA = {
  "super-lig": "Süper Lig", "premier-lig": "Premier League", "la-liga": "La Liga", "serie-a": "Serie A", "bundesliga": "Bundesliga", "ligue-1": "Ligue 1",
  "sampiyonlar-ligi": "UEFA Champions League", "avrupa-ligi": "UEFA Europa League", "konferans-ligi": "UEFA Europa Conference League",
  "liga-portugal": "Liga Portugal Betclic",
  "eredivisie": "Eredivisie",
  "belcika-ligi": "Jupiler Pro League",
  "norvec-ligi": "Eliteserien",
  "iskocya-ligi": "Scottish Premiership",
  "danimarka-ligi": "Danish Superliga"
};
function onbellekOku(anahtar) { try { return localStorage.getItem(anahtar); } catch (e) { return null; } }
function onbellekYaz(anahtar, deger) { try { localStorage.setItem(anahtar, deger); } catch (e) { /* olmadı, sorun değil */ } }
const wikiBekleyen = {};
function wikiAra(sorgu, boyut, orijinal) {
  const url = WIKI_API + "?action=query&format=json&origin=*&generator=search&gsrsearch=" + encodeURIComponent(sorgu) +
    "&gsrlimit=1&gsrnamespace=0&prop=pageimages&piprop=" + (orijinal ? "original|name" : "thumbnail|name") + "&pithumbsize=" + boyut;
  return wikiJson(url).then(function (v) {
    const sayfalar = v && v.query && v.query.pages ? Object.keys(v.query.pages).map(function (k) { return v.query.pages[k]; }) : [];
    const p = sayfalar[0];
    if (!p) return null;
    const kaynak = orijinal ? (p.original && p.original.source) : (p.thumbnail && p.thumbnail.source);
    return kaynak ? { url: kaynak, dosya: p.pageimage, sayfa: p.title } : null;
  });
}
// Kulüp/lig armaları neredeyse hep SVG'dir ve Wikipedia'nın "sayfa görseli" (pageimages) API'si
// SVG'leri çoğunlukla dışarıda bırakır (bu yüzden eski wikiLogo armalarda hep boş dönüyordu).
// Armalar için ayrı, daha güvenilir bir yol: sayfadaki TÜM dosyaları listele, dosya adına bakarak
// armayı seç (crest/logo/badge gibi kelimeler, yoksa kulüp adıyla birebir eşleşen dosya adı).
// Fotoğraflar (wikiFoto, aşağıda) için eski pageimages yolu kalıyor, orada sorun yok.
// Wikipedia API'sine kısa sürede çok istek gidince "You are making too many requests" hatası
// dönüyor (JSON değil düz metin). Bunu önlemek için: aynı anda en fazla birkaç istek + hata
// olursa bekleyip tekrar deneme.
let wikiEszamanli = 0;
const wikiKuyruk = [];
const WIKI_LIMIT = 3;
function wikiSiraDevamEt() {
  while (wikiEszamanli < WIKI_LIMIT && wikiKuyruk.length) {
    const gorev = wikiKuyruk.shift();
    wikiEszamanli++;
    gorev().then(function (v) { gorev.resolve(v); }, function (e) { gorev.reject(e); }).then(function () { wikiEszamanli--; wikiSiraDevamEt(); });
  }
}
function wikiSiradaCalistir(fn) {
  return new Promise(function (resolve, reject) {
    const gorev = fn;
    gorev.resolve = resolve; gorev.reject = reject;
    wikiKuyruk.push(gorev);
    wikiSiraDevamEt();
  });
}
function wikiJsonDene(url, deneme) {
  deneme = deneme || 0;
  return fetch(url).then(function (r) { return r.text(); }).then(function (metin) {
    try { return JSON.parse(metin); } catch (e) {
      if (deneme >= 2) return null;
      return new Promise(function (r) { setTimeout(r, 700 * (deneme + 1)); }).then(function () { return wikiJsonDene(url, deneme + 1); });
    }
  }).catch(function () {
    if (deneme >= 2) return null;
    return new Promise(function (r) { setTimeout(r, 700 * (deneme + 1)); }).then(function () { return wikiJsonDene(url, deneme + 1); });
  });
}
function wikiJson(url) { return wikiSiradaCalistir(function () { return wikiJsonDene(url, 0); }); }
function wikiSayfaBul(sorgu) {
  const url = WIKI_API + "?action=query&format=json&origin=*&list=search&srsearch=" + encodeURIComponent(sorgu) + "&srlimit=1&srnamespace=0";
  return wikiJson(url).then(function (v) {
    const s = v && v.query && v.query.search && v.query.search[0];
    return s ? s.title : null;
  });
}
function wikiSayfaResimleri(baslik, sayfaSayisi) {
  let devam = null, dosyalar = [];
  const adim = function (kalan) {
    let url = WIKI_API + "?action=query&format=json&origin=*&titles=" + encodeURIComponent(baslik) + "&generator=images&gimlimit=50&prop=info";
    if (devam) url += "&gimcontinue=" + encodeURIComponent(devam);
    return wikiJson(url).then(function (v) {
      const sayfalar = v && v.query && v.query.pages ? Object.values(v.query.pages) : [];
      dosyalar = dosyalar.concat(sayfalar.map(function (p) { return p.title; }).filter(Boolean));
      if (v && v.continue && v.continue.gimcontinue && kalan > 1) { devam = v.continue.gimcontinue; return adim(kalan - 1); }
      return dosyalar;
    });
  };
  return adim(sayfaSayisi || 3).catch(function () { return dosyalar; });
}
const ARMA_KOTU = /commons-logo|wiktionary|wikiquote|wikidata|wikisource|wikinews|wikivoyage|pictogram|kit[ _]|flag of|extended-protection|semi-protection|padlock|oojs|symbol_|edit-icon|folder|question_book|ambox|league performance|\bold\b|eski|former|historical|vintage|\.webm$|\.ogg$|\.oga$/i;
const ARMA_IYI = /crest|logo|badge|escudo|wappen|armoiries|stema|grb|embleem|wapen|s[ií]mbolo/i;
const ARMA_TARIHSEL = /\b(19|20)\d{2}[-–—](19|20)?\d{2,4}\b|\bpresent\b/i;
// Otomatik bulma bazı kulüplerde yanlış (eski/tarihi) armayı seçebiliyor, ya da kulübün sayfadaki
// dosya adı kulüp adından çok farklıysa (ör. sayfa başlığı "Sabah FK" ama dosya "Sabah FC.png")
// isim benzerliği de bulamıyor; kritik/doğrulanmış takımlar için tam dosya adını burada
// sabitliyoruz — bu varsa arama hiç yapılmaz.
const ARMA_SABIT = {
  "Galatasaray": "File:Galatasaray SK football logo.png",
  "Fenerbahçe": "File:Fenerbahçe.svg",
  "Sabah": "File:Sabah FC (Azerbaijan).png",
  "Académico de Viseu": "File:A.C. Viseu.svg",
  "Vitória de Guimarães": "File:Vitória Guimarães.svg",
  "OH Leuven": "File:OH LEUVEN.png",
  "Riga": "File:Riga Football Club.svg"
};
function sade(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/^file:/, "").replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]/g, ""); }
function armaDosyasiSec(dosyalar, baslik) {
  const temiz = dosyalar.filter(function (f) { return !ARMA_KOTU.test(f); });
  if (!temiz.length) return null;
  // 1) İSİM EŞLEŞMESİ (en güvenilir yöntem): büyük kulüplerin GÜNCEL forma arması Wikipedia'da
  // hemen hemen hep "Kulüp Adı.svg" gibi sayfa başlığıyla birebir aynı, sade bir dosya adı taşır
  // (ör. "FC Porto.svg", "Real Madrid CF.svg", "Arsenal FC.svg"). Eski/tarihi armalar ise
  // "Kulüp Adı 1990-1995.svg" gibi ek bilgiyle ayrışır. Bu yüzden önce isim benzerliğine bakıyoruz;
  // sadece anahtar kelimeye (crest/logo/escudo...) bakmak güncel dosyayı atlayıp (o kelimeyi hiç
  // içermediği için) yanlışlıkla eski/alakasız bir dosyayı seçtirebiliyordu.
  const st = sade(baslik);
  const puanla = function (f) {
    const sf = sade(f);
    if (sf === st) return 3;           // tam eşleşme
    if (sf.indexOf(st) === 0) return 2; // başlıkla başlıyor (ör. "arsenalfc" + ek)
    if (st.indexOf(sf) === 0) return 1; // dosya adı başlığın kısaltması
    return 0;
  };
  const isimAdaylari = temiz.map(function (f) { return { f: f, p: puanla(f) }; }).filter(function (x) { return x.p > 0; });
  if (isimAdaylari.length) {
    isimAdaylari.sort(function (a, b) { return b.p - a.p || a.f.length - b.f.length; });
    return isimAdaylari[0].f;
  }
  // 2) İsimle eşleşen dosya yoksa: crest/logo/badge gibi anahtar kelimeye bak. Tarihli (aralık ya
  // da tek bir yıl geçen) dosyalar genelde eski armalardır; yıl geçmeyenler önceliklidir.
  const aday = temiz.filter(function (f) { return ARMA_IYI.test(f); });
  if (!aday.length) return null;
  const yilVarMi = function (f) { return /\b(19|20)\d{2}\b/.test(f); };
  const tarihsiz = aday.filter(function (f) { return !yilVarMi(f) && !ARMA_TARIHSEL.test(f); });
  if (tarihsiz.length) return tarihsiz[0];
  const guncel = aday.filter(function (f) { return !ARMA_TARIHSEL.test(f); });
  const havuz = guncel.length ? guncel : aday;
  // Hiçbiri yılsız değilse (kulübün sayfasında yalnızca tarihli armalar varsa): en yeni yılı
  // içeren dosya tercih edilir, sonra SVG.
  const yilBul = function (f) { const m = f.match(/\b(19|20)\d{2}\b/g); return m ? Math.max.apply(null, m.map(Number)) : 0; };
  const siraliHavuz = havuz.slice().sort(function (a, b) { return yilBul(b) - yilBul(a) || a.length - b.length; });
  const enYeniYil = yilBul(siraliHavuz[0]);
  const enYeniler = siraliHavuz.filter(function (f) { return yilBul(f) === enYeniYil; });
  return enYeniler.find(function (f) { return /\.svg$/i.test(f); }) || enYeniler[0];
}
function wikiDosyaUrl(dosyaAdi, genislik) {
  const url = WIKI_API + "?action=query&format=json&origin=*&titles=" + encodeURIComponent(dosyaAdi) + "&prop=imageinfo&iiprop=url&iiurlwidth=" + (genislik || 160);
  return wikiJson(url).then(function (v) {
    const p = v && v.query && v.query.pages && Object.values(v.query.pages)[0];
    const info = p && p.imageinfo && p.imageinfo[0];
    return info ? (info.thumburl || info.url) : null;
  });
}
function armaAra(ad) {
  if (ARMA_SABIT[ad]) {
    const anahtar = "arma3:sabit:" + ad;
    const kayit = onbellekOku(anahtar);
    if (kayit) return Promise.resolve(kayit === "-" ? null : kayit);
    if (!wikiBekleyen[anahtar]) {
      // Başarısız (geçici rate-limit vb.) sonucu kalıcı önbelleğe YAZMIYORUZ; ayrıca bu bellek-içi
      // "beklenen" kaydını da siliyoruz ki bir sonraki çağrı (ör. sayfa aynı oturumda kalsa da)
      // yeniden denesin — yoksa tek bir geçici hata, o oturumun sonuna kadar hep boş/rozet gösterir.
      wikiBekleyen[anahtar] = wikiDosyaUrl(ARMA_SABIT[ad], 160).then(function (u) { if (u) onbellekYaz(anahtar, u); else delete wikiBekleyen[anahtar]; return u; }).catch(function () { delete wikiBekleyen[anahtar]; return null; });
    }
    return wikiBekleyen[anahtar];
  }
  return wikiLogo(takimAramaMetni(ad));
}
function wikiLogo(sorgu) {
  const anahtar = "arma3:" + sorgu;
  const kayit = onbellekOku(anahtar);
  if (kayit) return Promise.resolve(kayit === "-" ? null : kayit);
  if (!wikiBekleyen[anahtar]) {
    wikiBekleyen[anahtar] = wikiSayfaBul(sorgu).then(function (baslik) {
      if (!baslik) return null;
      return wikiSayfaResimleri(baslik, 3).then(function (dosyalar) {
        const secilen = armaDosyasiSec(dosyalar, baslik);
        return secilen ? wikiDosyaUrl(secilen, 160) : null;
      });
    }).then(function (u) {
      if (u) onbellekYaz(anahtar, u); else delete wikiBekleyen[anahtar];
      return u;
    }).catch(function () { delete wikiBekleyen[anahtar]; return null; });
  }
  return wikiBekleyen[anahtar];
}
function takimAramaMetni(ad) { return LOGO_ARAMA[ad] || (ad + " football club"); }

// Lisans/sanatçı bilgisi (Wikimedia Commons)
function wikiLisans(dosya) {
  const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=extmetadata&titles=" + encodeURIComponent("File:" + dosya);
  return wikiJson(url).then(function (v) {
    const p = v && v.query.pages[Object.keys(v.query.pages)[0]];
    const m = p && p.imageinfo && p.imageinfo[0] && p.imageinfo[0].extmetadata;
    if (!m) return null;
    const temiz = function (h) { return h ? String(h.value).replace(/<[^>]*>/g, "").trim() : ""; };
    return { sanatci: temiz(m.Artist), lisans: temiz(m.LicenseShortName) };
  }).catch(function () { return null; });
}
// Haber fotoğrafı: aday aramaları sırayla dene (ör. stadyum adı, sonra lig varsayılanı)
function wikiFoto(adaylar) {
  const anahtar = "foto:" + adaylar.join("|");
  const kayit = onbellekOku(anahtar);
  if (kayit) { try { const k = JSON.parse(kayit); return Promise.resolve(k); } catch (e) { /* devam */ } }
  const dene = function (i) {
    if (i >= adaylar.length) return Promise.resolve(null);
    return wikiAra(adaylar[i], 1200, false).then(function (s) {
      if (!s) return dene(i + 1);
      return wikiLisans(s.dosya).then(function (l) {
        const sonuc = { url: s.url, kredi: (l && l.sanatci ? l.sanatci : "Wikimedia Commons") + (l && l.lisans ? " (" + l.lisans + ")" : "") + " / Wikimedia Commons", kaynakUrl: "https://en.wikipedia.org/wiki/" + encodeURIComponent(s.sayfa.replace(/ /g, "_")) };
        onbellekYaz(anahtar, JSON.stringify(sonuc));
        return sonuc;
      });
    }).catch(function () { return dene(i + 1); });
  };
  return dene(0);
}
