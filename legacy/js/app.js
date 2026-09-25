// app.js: ANA SAYFA. Haberleri modüllere dağıtır:
//   şerit (son dakika) | manşet + yan liste | kartlar | numaralı öne çıkanlar
// (t, yerel: i18n.js  |  kategoriAdi, tarihYaz, haberVerisiniAl: ortak.js)

// ============ 1) DEĞİŞKENLER ============
const mansetAlani = document.getElementById("mansetAlani");
const yanListe = document.getElementById("yanListe");
const haberIzgara = document.getElementById("haberIzgara");
const oneCikanlar = document.getElementById("oneCikanlar");
const seritListe = document.getElementById("seritListe");
const skorListe = document.getElementById("skorListe");
const skorSekmeler = document.getElementById("skorSekmeler");
const mesaj = document.getElementById("mesaj");
const guncellemeBilgisi = document.getElementById("guncellemeBilgisi");

let tumHaberler = [];
let aktifKategori = "hepsi";
let guncellemeZamani = null;
let tumMaclar = [];            // data/maclar.json
let aktifMacLig = "super-lig";  // skor şeridinde seçili lig
const MAC_LIGLERI = ["super-lig", "premier-lig", "la-liga", "serie-a", "bundesliga", "ligue-1", "sampiyonlar-ligi", "avrupa-ligi", "konferans-ligi", "liga-portugal", "eredivisie", "belcika-ligi", "norvec-ligi", "iskocya-ligi", "danimarka-ligi"];

// ============ 2) KÜÇÜK YARDIMCILAR ============
// Eleman oluştur + sınıf + düz metin (güvenli yöntem)
function eleman(etiket, sinif, metin) {
  const el = document.createElement(etiket);
  if (sinif) el.className = sinif;
  if (metin) el.textContent = metin;
  return el;
}

// Kategori etiketi: renk CSS'te data-kat ile seçilir
function etiketOlustur(haber) {
  const e = eleman("span", "etiket", kategoriAdi(haber.kategori));
  e.dataset.kat = haber.kategori;
  return e;
}

function haberLinki(haber, sinif) {
  const a = eleman("a", sinif);
  a.href = "haber.html?id=" + encodeURIComponent(haber.id);
  return a;
}

function saatYaz(iso) {
  return new Date(iso).toLocaleTimeString(tarihKodu(), { hour: "2-digit", minute: "2-digit" });
}

function resimEkle(kutu, haber) {
  if (!yerel(haber.gorsel) && !(haber.foto && haber.foto.url) && !haber.fotoAra) return;
  const resim = document.createElement("img");
  fotoBagla(resim, haber);
  resim.alt = yerel(haber.gorselAlt) || yerel(haber.baslik);
  resim.loading = "lazy";
  kutu.append(resim);
}

function mesajGoster(anahtar) {
  if (anahtar) {
    mesaj.dataset.i18n = anahtar;
    mesaj.textContent = t(anahtar);
  } else {
    delete mesaj.dataset.i18n;
    mesaj.textContent = "";
  }
}

// ============ 3) MODÜLLER ============
// a) Son dakika şeridi: en yeni 5 haber, saatiyle
function seritCiz() {
  seritListe.innerHTML = "";
  tumHaberler.slice(0, 5).forEach(function (h) {
    const a = haberLinki(h, "serit-oge");
    a.append(eleman("time", "serit-saat", saatYaz(h.tarih)), document.createTextNode(" " + yerel(h.baslik)));
    seritListe.append(a);
  });
}

// b) Manşet: görselin üstüne yazılı büyük kart
function mansetCiz(haber) {
  mansetAlani.innerHTML = "";
  const kart = haberLinki(haber, "manset");
  const gorsel = eleman("div", "gorsel");
  resimEkle(gorsel, haber);
  const icerik = eleman("div", "manset-yazi");
  icerik.append(
    etiketOlustur(haber),
    eleman("h2", "", yerel(haber.baslik)),
    eleman("p", "manset-ozet", yerel(haber.ozet))
  );
  kart.append(gorsel, icerik);
  mansetAlani.append(kart);
}

// c) Manşetin yanındaki saatli "Son haberler" listesi
function yanListeCiz(liste) {
  yanListe.innerHTML = "";
  liste.forEach(function (h) {
    const li = document.createElement("li");
    const a = haberLinki(h, "");
    const yazi = eleman("span", "saatli-yazi", "");
    yazi.append(etiketOlustur(h), eleman("span", "saatli-baslik", yerel(h.baslik)));
    a.append(eleman("time", "saatli-saat", saatYaz(h.tarih)), yazi);
    li.append(a);
    yanListe.append(li);
  });
}

// c2) Skor şeridi: rozet yerine takım kodu (kendi tasarımımız, logo yok)
function macZamani(m) {
  const d = new Date(m.tarih);
  const gun = d.toLocaleDateString(tarihKodu(), { day: "numeric", month: "short" });
  if (m.tur) return yerel(m.tur);
  return m.saat ? gun + " " + saatYaz(m.tarih) : gun;   // saat bilinmiyorsa sadece gün
}
function takimSatiri(takim, gol) {
  const satir = eleman("div", "mac-takim", "");
  satir.append(armaOlustur(takim), eleman("span", "mac-ad", takim.ad));
  satir.append(eleman("b", "mac-gol", gol === null ? "" : String(gol)));
  return satir;
}
// Lig sekmeleri: Süper Lig + 5 büyük lig; her birinin maçları ayrı kayan şeritte
function skorSekmeleriCiz() {
  skorSekmeler.innerHTML = "";
  MAC_LIGLERI.forEach(function (lig) {
    const dugme = eleman("button", "skor-sekme" + (lig === aktifMacLig ? " aktif" : ""), kategoriAdi(lig));
    dugme.type = "button";
    dugme.dataset.lig = lig;
    dugme.setAttribute("role", "tab");
    dugme.setAttribute("aria-selected", lig === aktifMacLig ? "true" : "false");
    if (tumMaclar.some(function (m) { return m.lig === lig && m.canli; })) dugme.prepend(eleman("span", "canli-nokta", ""));
    ligIkonuEkle(dugme, lig);
    dugme.addEventListener("click", function () {
      aktifMacLig = lig;
      skorCiz();
    });
    skorSekmeler.append(dugme);
  });
}
function skorCiz() {
  skorSekmeleriCiz();
  skorListe.innerHTML = "";
  const ligMaclari = tumMaclar
    .filter(function (m) { return m.lig === aktifMacLig; })
    .sort(function (a, b) { return new Date(a.tarih) - new Date(b.tarih); });   // eskiden yeniye

  if (ligMaclari.length === 0) {
    skorListe.append(eleman("p", "skor-bos", t("mac.yok")));
    return;
  }
  ligMaclari.forEach(function (m) {
    const kart = eleman("div", "mac" + (m.canli ? " canli" : ""), "");
    const bitti = Array.isArray(m.skor);
    const durum = eleman("div", "mac-durum" + (m.canli ? " canli-yazi" : bitti ? " bitti" : ""), "");
    if (m.canli) { durum.append(eleman("span", "canli-nokta", ""), document.createTextNode(t("canli.yazi") + (m.dakika ? " · " + m.dakika : ""))); }
    else durum.textContent = (bitti ? t("mac.bitti") + " · " : "") + macZamani(m);
    kart.append(takimSatiri(m.ev, bitti ? m.skor[0] : null), takimSatiri(m.dep, bitti ? m.skor[1] : null), durum);
    skorListe.append(kart);
  });
}

// d) Kartlar
function kartOlustur(haber) {
  const kart = haberLinki(haber, "kart");
  const gorsel = eleman("div", "gorsel");
  resimEkle(gorsel, haber);
  const icerik = eleman("div", "icerik");
  icerik.append(
    etiketOlustur(haber),
    eleman("h3", "", yerel(haber.baslik)),
    eleman("p", "ozet", yerel(haber.ozet)),
    eleman("div", "kunye", tarihYaz(haber.tarih))
  );
  kart.append(gorsel, icerik);
  return kart;
}

// e) Numaralı liste (1, 2, 3...). Numarayı CSS sayacı verir.
function oneCikanCiz() {
  oneCikanlar.innerHTML = "";
  tumHaberler.slice(0, 5).forEach(function (h) {
    const li = document.createElement("li");
    const a = haberLinki(h, "");
    a.append(etiketOlustur(h), eleman("span", "numarali-baslik", yerel(h.baslik)));
    li.append(a);
    oneCikanlar.append(li);
  });
}

// ============ 4) HEPSİNİ ÇİZ ============
function ekraniYenile() {
  let liste = aktifKategori === "hepsi"
    ? tumHaberler.slice()
    : tumHaberler.filter(function (h) { return h.kategori === aktifKategori; });
  // Editörün seçtiği ("manset": true) haber varsa manşete o çıkar; yoksa en yeni haber.
  liste.sort(function (a, b) { return (b.manset === true) - (a.manset === true); });   // sıralama kararlı: diğerlerinin sırası bozulmaz

  seritCiz();
  skorCiz();
  oneCikanCiz();

  mansetAlani.innerHTML = "";
  yanListe.innerHTML = "";
  haberIzgara.innerHTML = "";

  if (liste.length === 0) {
    mesajGoster("mesaj.bosKategori");
  } else {
    mesajGoster(null);
    mansetCiz(liste[0]);
    yanListeCiz(liste.slice(1, 6));                       // manşetin yanı: 5 haber
    liste.slice(6).forEach(function (h) { haberIzgara.append(kartOlustur(h)); });
  }

  if (guncellemeZamani) {
    guncellemeBilgisi.textContent = t("alt.guncelleme") + " " + tarihYaz(guncellemeZamani);
  }
  document.title = t("sayfa.baslik");
}

document.querySelectorAll(".kat-dugme").forEach(function (dugme) {
  dugme.addEventListener("click", function () {
    document.querySelectorAll(".kat-dugme").forEach(function (d) { d.classList.remove("aktif"); });
    dugme.classList.add("aktif");
    aktifKategori = dugme.dataset.kategori;
    temaUygula(aktifKategori);
    if (MAC_LIGLERI.indexOf(aktifKategori) >= 0) { aktifMacLig = aktifKategori; skorSekmeleriCiz(); skorCiz(); }
    ekraniYenile();
  });
});

document.addEventListener("dilDegisti", ekraniYenile);

// ============ 5) BAŞLAT ============
async function baslat() {
  mesajGoster("mesaj.yukleniyor");
  try {
    const veri = await haberVerisiniAl();
    tumHaberler = veri.haberler;
    guncellemeZamani = veri.guncelleme;
    try {
      const cevap = await fetch("data/maclar.json");
      tumMaclar = (await cevap.json()).maclar;   // skor şeridi yüklenmese de site çalışsın
    } catch (hata) {
      console.warn("maclar.json okunamadı", hata);
    }
    ekraniYenile();
  } catch (hata) {
    mesajGoster("mesaj.yuklenemedi");
    console.error(hata);
  }
}

baslat();

// Canlı skor: maclar.json her 30 sn yeniden okunur (canli:true + dakika alanları)
setInterval(async function () {
  try {
    const c = await fetch("data/maclar.json?t=" + Date.now(), { cache: "no-store" });
    tumMaclar = (await c.json()).maclar;
    skorCiz();
  } catch (h) {}
}, 30000);
try {
  const lp = new URLSearchParams(location.search).get("lig");
  const d = lp && document.querySelector('.kat-dugme[data-kategori="' + lp + '"]');
  if (d) setTimeout(function () { d.click(); }, 400);
} catch (h) {}


// ============ SIRADAKİ MAÇLAR (data/fikstur.json) ============
let fikstur = [];
function siradakiCiz() {
  const bolum = document.getElementById("siradakiMaclar");
  const kap = document.getElementById("siradakiListe");
  if (!bolum || !kap) return;
  const simdi = Date.now() - 3 * 3600 * 1000;
  const liste = fikstur.filter(function (m) {
    return !m.skor && new Date(m.tarih).getTime() >= simdi && (aktifKategori === "hepsi" || aktifKategori === m.lig);
  }).sort(function (a, b) { return new Date(a.tarih) - new Date(b.tarih); }).slice(0, 12);
  kap.textContent = "";
  bolum.hidden = liste.length === 0;
  liste.forEach(function (m) {
    const k = eleman("a", "sr-kart");
    k.href = "mac.html?id=" + encodeURIComponent(m.id);
    const d = new Date(m.tarih);
    k.append(eleman("div", "sr-tarih", d.toLocaleDateString(tarihKodu(), { day: "numeric", month: "short", weekday: "short" }) + (m.saatBelli === false ? "" : " · " + d.toLocaleTimeString(tarihKodu(), { hour: "2-digit", minute: "2-digit" })) + " · " + kategoriAdi(m.lig)));
    [m.ev, m.dep].forEach(function (tk) {
      const s = eleman("div", "sr-takimlar");
      s.append(armaOlustur(tk), eleman("span", "", tk.ad));
      k.append(s);
    });
    k.append(eleman("div", "sr-yer", (m.stat || "") + (m.hakem ? " · " + t("mm.hakem") + ": " + m.hakem : "")));
    kap.append(k);
  });
}
fetch("data/fikstur.json").then(function (r) { return r.json(); }).then(function (v) { fikstur = v.maclar; siradakiCiz(); }).catch(function () {});
document.addEventListener("dilDegisti", siradakiCiz);
document.querySelectorAll(".kat-dugme").forEach(function (d) { d.addEventListener("click", siradakiCiz); });
