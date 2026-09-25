// haber.js: TEK BİR HABERİN SAYFASI (haber.html?id=...)
// (t, yerel: i18n.js  |  kategoriAdi, tarihYaz, haberVerisiniAl: ortak.js)

const makale = document.getElementById("makale");
const ilgiliAlan = document.getElementById("ilgiliAlan");
const ilgiliIzgara = document.getElementById("ilgiliIzgara");

// Adres: haber.html?id=sl-trabzon-gs  ->  id = "sl-trabzon-gs"
const haberId = new URLSearchParams(window.location.search).get("id");

let tumHaberler = [];
let aktifHaber = null;

// Küçük yardımcı: eleman oluşturup içine düz metin koyar (güvenli yöntem)
function eleman(etiket, sinif, metin) {
  const el = document.createElement(etiket);
  if (sinif) el.className = sinif;
  if (metin) el.textContent = metin;
  return el;
}

function mesajYaz(anahtar) {
  makale.innerHTML = "";
  const p = eleman("p", "mesaj", t(anahtar));
  p.dataset.i18n = anahtar; // dil değişince kendiliğinden çevrilir
  makale.append(p);
}

function haberiCiz(haber) {
  const baslik = yerel(haber.baslik);
  document.title = baslik + " | " + t("sayfa.baslik");
  makale.innerHTML = "";

  makale.append(eleman("span", "etiket", kategoriAdi(haber.kategori)));
  makale.append(eleman("h1", "makale-baslik", baslik));
  makale.append(eleman("p", "kunye", tarihYaz(haber.tarih)));

  if (yerel(haber.gorsel) || (haber.foto && haber.foto.url)) {
    const resim = document.createElement("img");
    resim.className = "makale-gorsel";
    const kredi = fotoKredisi(haber);
    fotoBagla(resim, haber, kredi);
    resim.alt = yerel(haber.gorselAlt) || baslik;
    makale.append(resim, kredi);
  }

  yerel(haber.govde).forEach(function (paragraf) {
    makale.append(eleman("p", "paragraf", paragraf));
  });
  (haber.video || []).forEach(function (v) { makale.append(videoOlustur(v)); });
  if (haber.macId) {
    const bag = eleman("p", "paragraf");
    const a = eleman("a", "geri", t("haber.macMerkezi"));
    a.href = "mac.html?id=" + encodeURIComponent(haber.macId);
    bag.append(a);
    makale.append(bag);
  }

  if (haber.kaynaklar && haber.kaynaklar.length > 0) {
    makale.append(
      eleman("p", "kaynak-notu", t("haber.kaynakNotu", { kaynaklar: haber.kaynaklar.join(", ") }))
    );
  }
}

function ilgiliHaberleriCiz() {
  ilgiliIzgara.innerHTML = "";
  const benzerler = tumHaberler.filter(function (h) {
    return h.kategori === aktifHaber.kategori && h.id !== aktifHaber.id;
  }).slice(0, 3);

  if (benzerler.length === 0) {
    ilgiliAlan.hidden = true;
    return;
  }

  benzerler.forEach(function (h) {
    const kart = eleman("a", "kart");
    kart.href = "haber.html?id=" + encodeURIComponent(h.id);
    const gorsel = eleman("div", "gorsel");
    if (yerel(h.gorsel) || (h.foto && h.foto.url)) {
      const resim = document.createElement("img");
      fotoBagla(resim, h);
      resim.alt = yerel(h.gorselAlt) || yerel(h.baslik);
      resim.loading = "lazy";
      gorsel.append(resim);
    }
    const icerik = eleman("div", "icerik");
    icerik.append(eleman("h3", "", yerel(h.baslik)), eleman("div", "kunye", tarihYaz(h.tarih)));
    kart.append(gorsel, icerik);
    ilgiliIzgara.append(kart);
  });
  ilgiliAlan.hidden = false;
}

function ekraniYenile() {
  if (!aktifHaber) return; // haber bulunamadıysa mesaj zaten data-i18n ile çevrilir
  haberiCiz(aktifHaber);
  ilgiliHaberleriCiz();
}

document.addEventListener("dilDegisti", ekraniYenile);

async function baslat() {
  mesajYaz("mesaj.haberYukleniyor");
  try {
    const veri = await haberVerisiniAl();
    tumHaberler = veri.haberler;
    aktifHaber = tumHaberler.find(function (h) {
      return h.id === haberId;
    }) || null;

    if (!aktifHaber) {
      mesajYaz("mesaj.haberYok");
      return;
    }
    ekraniYenile();
  } catch (hata) {
    mesajYaz("mesaj.yuklenemedi");
    console.error(hata);
  }
}

baslat();
