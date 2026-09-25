// kose.js: yazar köşesi (liste + tek analiz sayfası)
function eleman(etiket, sinif, metin) {
  const e = document.createElement(etiket);
  if (sinif) e.className = sinif;
  if (metin !== undefined) e.textContent = metin;
  return e;
}
let koseVeri = null;
const koseParam = new URLSearchParams(location.search);
const gorunur = function (a) { return !a.taslak || koseParam.get("taslak") === "1"; };

function koseCiz() {
  if (!koseVeri) return;
  const kap = document.getElementById("koseIcerik");
  kap.textContent = "";
  const id = koseParam.get("id");
  const liste = koseVeri.analizler.filter(gorunur).sort(function (a, b) { return new Date(b.tarih) - new Date(a.tarih); });
  if (id) {
    const a = koseVeri.analizler.find(function (x) { return x.id === id; });
    if (!a) { kap.append(eleman("p", "mesaj", t("mesaj.haberYok"))); return; }
    if (a.taslak) kap.append(eleman("span", "taslak-etiket", "TASLAK"));
    if (a.ornek) kap.append(eleman("span", "taslak-etiket", yerel({ tr: "ÖRNEK ANALİZ · Claude taslağı, yazar düzeltip yayınlar", en: "SAMPLE ANALYSIS · Claude draft, author edits before publishing" })));
    if (a.macId) { const ml = eleman("a", "mac-baglanti", t("haber.macMerkezi")); ml.href = "mac.html?id=" + encodeURIComponent(a.macId); kap.append(ml); }
    kap.append(eleman("h1", "makale-baslik", yerel(a.baslik)));
    const y = eleman("div", "kose-yazar");
    y.append(eleman("span", "avatar", koseVeri.yazar.split(" ").map(function (s) { return s[0]; }).join("")), eleman("span", "", koseVeri.yazar + " · " + tarihYaz(a.tarih)));
    kap.append(y);
    if (a.saha) {
      const fig = eleman("figure", "saha-kutu");
      sahaCiz(fig, a.saha);
      if (a.saha.aciklama) fig.append(eleman("figcaption", "", yerel(a.saha.aciklama)));
      kap.append(fig);
    }
    yerel(a.govde).forEach(function (p) { kap.append(eleman("p", "paragraf", p)); });
    (a.video || []).forEach(function (v) { kap.append(videoOlustur(v)); });
    return;
  }
  const l = eleman("div", "kose-liste");
  liste.forEach(function (a) {
    const k = eleman("a", "kose-kart");
    k.href = "kose.html?id=" + encodeURIComponent(a.id);
    const y = eleman("div", "kose-yazar");
    y.append(eleman("span", "avatar", koseVeri.yazar.split(" ").map(function (s) { return s[0]; }).join("")), eleman("span", "", koseVeri.yazar + " · " + tarihYaz(a.tarih)));
    if (a.ornek) k.append(eleman("span", "taslak-etiket", yerel({ tr: "ÖRNEK ANALİZ", en: "SAMPLE" })));
    k.append(y, eleman("h3", "", yerel(a.baslik)), eleman("p", "ozet", yerel(a.ozet)));
    l.append(k);
  });
  if (liste.length === 0) l.append(eleman("p", "mesaj", t("kose.bos")));
  kap.append(l);
}
fetch("data/analizler.json").then(function (r) { return r.json(); }).then(function (v) { koseVeri = v; koseCiz(); })
  .catch(function () { document.getElementById("koseIcerik").textContent = t("mesaj.yuklenemedi"); });
document.addEventListener("dilDegisti", koseCiz);
