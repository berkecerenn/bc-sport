// puan.js: puan durumu sayfası
function eleman(etiket, sinif, metin) {
  const e = document.createElement(etiket);
  if (sinif) e.className = sinif;
  if (metin !== undefined) e.textContent = metin;
  return e;
}
let pdVeri = null, pdAktif = "super-lig", pdMaclar = [];
const UEFA_KODLARI = ["sampiyonlar-ligi", "avrupa-ligi", "konferans-ligi"];
function adSade(x) { return String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ""); }
function ayniTakim(a, b) { const x = adSade(a), y = adSade(b); return x === y || (x.length > 3 && y.length > 3 && (x.indexOf(y) >= 0 || y.indexOf(x) >= 0)); }
// Canlı puan durumu: şu an oynanan maçların anlık skorunu tabloya işler (puan.json bu maçları içermez)
function canliTablo(l) {
  const canli = pdMaclar.filter(function (m) { return m.canli && m.lig === l.kod && Array.isArray(m.skor); });
  const eski = l.tablo.map(function (s, i) { return Object.assign({}, s, { sira: i + 1 }); });
  if (!canli.length) return { tablo: eski, canliVar: false };
  const tablo = eski.map(function (s) { return Object.assign({}, s); });
  const bul = function (ad) { return tablo.find(function (s) { return ayniTakim(s.takim, ad); }); };
  canli.forEach(function (m) {
    [[m.ev, m.skor[0], m.skor[1]], [m.dep, m.skor[1], m.skor[0]]].forEach(function (k) {
      const s = bul(k[0].ad); if (!s) return;
      s.o += 1; s.gf += k[1]; s.y += k[1] - k[2]; s.canli = true;
      if (k[1] > k[2]) { s.g += 1; s.p += 3; } else if (k[1] === k[2]) { s.b += 1; s.p += 1; } else { s.m += 1; }
    });
  });
  tablo.sort(function (a, b) { return b.p - a.p || b.y - a.y || b.gf - a.gf; });
  return { tablo: tablo, canliVar: true };
}

function pdCiz() {
  if (!pdVeri) return;
  const sek = document.getElementById("pdSekmeler");
  sek.textContent = "";
  pdVeri.ligler.forEach(function (l) {
    const d = eleman("button", "kat-dugme" + (l.kod === pdAktif ? " aktif" : ""), t("kat." + l.kod));
    d.addEventListener("click", function () { pdAktif = l.kod; pdCiz(); });
    sek.appendChild(d);
  });
  const l = pdVeri.ligler.find(function (x) { return x.kod === pdAktif; });
  const ct = canliTablo(l);
  const n = ct.tablo.length;
  const kutu = document.getElementById("pdIcerik");
  kutu.textContent = "";
  const tablo = eleman("table", "tr-tablo pd-tablo");
  const ust = eleman("tr");
  ["#", "pd.takim", "pd.o", "pd.g", "pd.b", "pd.m", "pd.av", "pd.p"].forEach(function (k, i) {
    ust.appendChild(eleman("th", i > 1 ? "sayi" : "", i === 0 ? "#" : t(k)));
  });
  tablo.appendChild(ust);
  if (ct.canliVar) { const b = eleman("p", "pd-canli-bilgi", ""); b.append(eleman("span", "canli-nokta", ""), document.createTextNode(t("pd.canliBilgi"))); kutu.appendChild(b); }
  ct.tablo.forEach(function (s, i) {
    const uefa = UEFA_KODLARI.indexOf(l.kod) >= 0;
    const r = eleman("tr", uefa ? (i < 8 ? "ust-grup" : (i < 24 ? "orta-grup" : "alt-grup")) : (i < 4 ? "ust-grup" : (i >= n - 3 ? "alt-grup" : "")));
    const sr = eleman("td", "", String(i + 1));
    if (ct.canliVar && s.sira && s.sira !== i + 1) sr.append(eleman("small", s.sira > i + 1 ? "yukari" : "asagi", s.sira > i + 1 ? " ▲" : " ▼"));
    r.appendChild(sr);
    const tk = eleman("td", "pd-takim"); const ic = eleman("span", "pd-ic"); ic.append(armaOlustur({ ad: s.takim }), eleman("span", "", s.takim)); if (s.canli) ic.append(eleman("span", "canli-nokta", "")); tk.append(ic); r.appendChild(tk);
    [s.o, s.g, s.b, s.m, (s.y > 0 ? "+" : "") + s.y, s.p].forEach(function (x, j) {
      r.appendChild(eleman("td", "sayi" + (j === 5 ? " puan" : ""), String(x)));
    });
    tablo.appendChild(r);
  });
  kutu.appendChild(tablo);
  document.getElementById("pdTarih").textContent = t("pd.tarih") + " " + l.tarih + " · " + l.kaynak;
  document.getElementById("pdNot").textContent = (l.not ? yerel(l.not) + " " : "") + yerel(pdVeri.genelNot);
}
function maclariYukle() { return fetch("data/maclar.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (v) { pdMaclar = v.maclar; }).catch(function () {}); }
setInterval(function () { maclariYukle().then(pdCiz); }, 30000);
maclariYukle().then(function () { pdCiz(); });
fetch("data/puan.json").then(function (r) { return r.json(); }).then(function (v) { pdVeri = v; pdCiz(); })
  .catch(function () { document.getElementById("pdIcerik").textContent = t("mesaj.yuklenemedi"); });
document.addEventListener("dilDegisti", pdCiz);
