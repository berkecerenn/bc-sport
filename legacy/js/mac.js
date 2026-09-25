// mac.js: maç merkezi (stat, hakem, saat, maç öncesi/sonrası, demeçler, konaklama, antrenman, video)
function eleman(etiket, sinif, metin) {
  const e = document.createElement(etiket);
  if (sinif) e.className = sinif;
  if (metin !== undefined) e.textContent = metin;
  return e;
}
let fiksturVeri = null;
function bolum(baslikAnahtar, icerikFn) {
  const b = eleman("section", "mm-bolum");
  b.append(eleman("h3", "", t(baslikAnahtar)));
  icerikFn(b);
  return b;
}
function macCiz() {
  if (!fiksturVeri) return;
  const kap = document.getElementById("macIcerik");
  kap.textContent = "";
  const id = new URLSearchParams(location.search).get("id");
  const m = fiksturVeri.maclar.find(function (x) { return x.id === id; });
  if (!m) { kap.append(eleman("p", "mesaj", t("mm.yok"))); return; }
  document.body.dataset.tema = m.lig;
  const bas = eleman("div", "mac-merkezi-baslik");
  const ev = eleman("div", "mm-takim"); ev.append(armaOlustur(m.ev, true), eleman("span", "", m.ev.ad));
  const dep = eleman("div", "mm-takim dep"); dep.append(eleman("span", "", m.dep.ad), armaOlustur(m.dep, true));
  const orta = eleman("div", "mm-orta");
  orta.append(eleman("div", "mm-skor", m.skor ? m.skor[0] + " - " + m.skor[1] : "vs"));
  if (m.canli) { const cd = eleman("div", "mac-durum canli-yazi", ""); cd.append(eleman("span", "canli-nokta", ""), document.createTextNode(t("canli.yazi") + (m.dakika ? " · " + m.dakika : ""))); orta.append(cd); }
  const d = new Date(m.tarih);
  orta.append(eleman("div", "mm-zaman", d.toLocaleDateString(tarihKodu(), { day: "numeric", month: "long", weekday: "long" }) + (m.saatBelli === false ? "" : " · " + d.toLocaleTimeString(tarihKodu(), { hour: "2-digit", minute: "2-digit" }))));
  if (m.hafta) orta.append(eleman("div", "mm-zaman", kategoriAdi(m.lig) + " · " + t("mm.hafta") + " " + m.hafta));
  bas.append(ev, orta, dep);
  kap.append(bas);

  const bilgi = eleman("div", "mm-bilgi");
  [["mm.stat", (m.stat || "") + (m.sehir ? ", " + m.sehir : "")], ["mm.hakem", m.hakem], ["mm.var", m.var], ["mm.yayin", m.yayin]].forEach(function (r) {
    const k = eleman("div");
    k.append(eleman("b", "", t(r[0])), document.createTextNode(r[1] || t("mm.aciklanmadi")));
    bilgi.append(k);
  });
  kap.append(bilgi);

  const metinBolumu = function (anahtar, alan) {
    if (!m[alan] || (Array.isArray(m[alan]) && !m[alan].length)) return;
    const par = [].concat(yerel(m[alan]) || []).filter(function (p) { return p && String(p).trim(); });
    if (!par.length) return;
    kap.append(bolum(anahtar, function (b) { par.forEach(function (p) { b.append(eleman("p", "paragraf", p)); }); }));
  };
  metinBolumu("mm.oncesi", "oncesi");
  metinBolumu("mm.sonrasi", "sonrasi");
  if (m.demecler && m.demecler.length) {
    kap.append(bolum("mm.demecler", function (b) {
      m.demecler.forEach(function (x) {
        const dm = eleman("div", "demec");
        dm.append(eleman("q", "", String(yerel(x.metin)).replace(/^[\s"“”„«]+|[\s"“”„»]+$/g, "")));
        const kim = x.kim + (x.rol ? " (" + x.rol + ")" : "") + " · " + t(x.tur === "sonra" ? "mm.sonra" : "mm.once");
        const s = eleman("small", "", kim + (x.kaynak ? " · " + x.kaynak : ""));
        dm.append(s);
        b.append(dm);
      });
    }));
  }
  metinBolumu("mm.konaklama", "konaklama");
  metinBolumu("mm.antrenman", "antrenman");
  if (m.video && m.video.length) kap.append(bolum("mm.videolar", function (b) { m.video.forEach(function (v) { b.append(videoOlustur(v)); }); }));
  if (m.kaynaklar && m.kaynaklar.length) kap.append(eleman("p", "sayfa-not", t("mm.kaynaklar") + ": " + m.kaynaklar.join(", ")));
  document.title = m.ev.ad + " - " + m.dep.ad + " · BC Sport";
}
fetch("data/fikstur.json").then(function (r) { return r.json(); }).then(function (v) { fiksturVeri = v; macCiz(); })
  .catch(function () { document.getElementById("macIcerik").textContent = t("mesaj.yuklenemedi"); });
document.addEventListener("dilDegisti", macCiz);
