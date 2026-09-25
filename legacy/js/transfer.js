// transfer.js: Süper Lig transfer tablosu
function eleman(etiket, sinif, metin) {
  const e = document.createElement(etiket);
  if (sinif) e.className = sinif;
  if (metin !== undefined) e.textContent = metin;
  return e;
}

let trVeri = null;
let seciliKulup = null;
const TUR = { T: "tr.tur.T", K: "tr.tur.K", B: "tr.tur.B" };

function bedelYaz(o) {
  if (o.bedel) return "€" + o.bedel.toLocaleString(tarihKodu()) + (aktifDil === "tr" ? " milyon" : "M");
  if (o.tur === "K") return t("tr.kiraBedeli");
  if (o.tur === "B") return "—";
  return t("tr.aciklanmadi");
}

function tabloYap(baslik, liste, sinif) {
  const kutu = eleman("div", "tr-kutu " + sinif);
  kutu.appendChild(eleman("h3", "", baslik + " (" + liste.length + ")"));
  const tablo = eleman("table", "tr-tablo");
  const ust = eleman("tr");
  ["tr.oyuncu", "tr.tur", "tr.bedel"].forEach(function (k) { ust.appendChild(eleman("th", "", t(k))); });
  tablo.appendChild(ust);
  const sirali = liste.slice().sort(function (a, b) { return (b.bedel || 0) - (a.bedel || 0); });
  sirali.forEach(function (o) {
    const s = eleman("tr");
    s.appendChild(eleman("td", "", o.oyuncu));
    const td = eleman("td");
    td.appendChild(eleman("span", "tur-rozet tur-" + o.tur, t(TUR[o.tur])));
    s.appendChild(td);
    s.appendChild(eleman("td", o.bedel ? "bedel-var" : "", bedelYaz(o)));
    tablo.appendChild(s);
  });
  kutu.appendChild(tablo);
  return kutu;
}

function trCiz() {
  if (!trVeri) return;
  const kutu = document.getElementById("trKulupler");
  kutu.textContent = "";
  trVeri.kulupler.forEach(function (k) {
    const d = eleman("button", "kat-dugme" + (k.ad === seciliKulup ? " aktif" : ""), k.ad);
    d.addEventListener("click", function () { seciliKulup = k.ad; trCiz(); });
    kutu.appendChild(d);
  });
  const k = trVeri.kulupler.find(function (x) { return x.ad === seciliKulup; });
  const ic = document.getElementById("trIcerik");
  ic.textContent = "";
  const say = eleman("p", "tr-ozet", t("tr.ozet", { g: k.gelen.length, c: k.giden.length }));
  ic.appendChild(say);
  const izgara = eleman("div", "tr-izgara");
  izgara.appendChild(tabloYap(t("tr.gelen"), k.gelen, "gelen"));
  izgara.appendChild(tabloYap(t("tr.giden"), k.giden, "giden"));
  ic.appendChild(izgara);
  document.getElementById("trDonem").textContent = trVeri.donem + " · " + t("alt.guncelleme") + " " + trVeri.guncelleme + " · " + trVeri.kaynaklar.join(", ");
  document.getElementById("trNot").textContent = yerel(trVeri.not);
}

fetch("data/transferler.json").then(function (r) { return r.json(); }).then(function (v) {
  trVeri = v; seciliKulup = v.kulupler[0].ad; trCiz();
}).catch(function () {
  document.getElementById("trIcerik").textContent = t("mesaj.yuklenemedi");
});
document.addEventListener("dilDegisti", trCiz);
