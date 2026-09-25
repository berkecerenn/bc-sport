// saha.js: analizler için çizgi karakterli saha diyagramı (SVG)
// Koordinatlar 0-100: x = sahanın boyu (sol kale=0, sağ kale=100), y = eni (üst=0, alt=100).
const SVG_NS = "http://www.w3.org/2000/svg";
function sv(ad, ozellik, ic) {
  const e = document.createElementNS(SVG_NS, ad);
  Object.keys(ozellik || {}).forEach(function (k) { e.setAttribute(k, ozellik[k]); });
  if (ic !== undefined) e.textContent = ic;
  return e;
}
const SW = 1050, SH = 680, PAD = 30;
function px(x) { return PAD + (x / 100) * (SW - 2 * PAD); }
function py(y) { return PAD + (y / 100) * (SH - 2 * PAD); }

function sahaZemini(svg) {
  svg.append(sv("rect", { width: SW, height: SH, fill: "#2f8f4e" }));
  const seritGenislik = (SW - 2 * PAD) / 10;
  for (let i = 0; i < 10; i += 2) svg.append(sv("rect", { x: PAD + i * seritGenislik, y: PAD, width: seritGenislik, height: SH - 2 * PAD, fill: "#37a058" }));
  const cizgi = { fill: "none", stroke: "#ffffff", "stroke-width": 3, opacity: 0.9 };
  svg.append(sv("rect", Object.assign({ x: PAD, y: PAD, width: SW - 2 * PAD, height: SH - 2 * PAD }, cizgi)));
  svg.append(sv("line", Object.assign({ x1: px(50), y1: PAD, x2: px(50), y2: SH - PAD }, cizgi)));
  svg.append(sv("circle", Object.assign({ cx: px(50), cy: py(50), r: 78 }, cizgi)));
  svg.append(sv("circle", { cx: px(50), cy: py(50), r: 5, fill: "#fff" }));
  [[0, 1], [100, -1]].forEach(function (t) {
    const x0 = px(t[0]), yon = t[1];
    svg.append(sv("rect", Object.assign({ x: yon > 0 ? x0 : x0 - 165, y: py(21.1), width: 165, height: py(78.9) - py(21.1) }, cizgi)));
    svg.append(sv("rect", Object.assign({ x: yon > 0 ? x0 : x0 - 55, y: py(37), width: 55, height: py(63) - py(37) }, cizgi)));
    svg.append(sv("circle", { cx: x0 + yon * 110, cy: py(50), r: 4, fill: "#fff" }));
  });
}

// Çizgi karakter: kafa (daire), gövde, kol, bacak; üstünde forma numarası
function oyuncuCiz(svg, o, renk) {
  const cx = px(o.x), cy = py(o.y);
  const g = sv("g", { transform: "translate(" + cx + " " + cy + ")" });
  const k = { stroke: renk, "stroke-width": 4, "stroke-linecap": "round", fill: "none" };
  g.append(sv("ellipse", { cx: 0, cy: 30, rx: 16, ry: 5, fill: "rgba(0,0,0,.22)" }));
  g.append(sv("circle", { cx: 0, cy: -22, r: 9, fill: "#fff", stroke: renk, "stroke-width": 4 }));
  g.append(sv("line", Object.assign({ x1: 0, y1: -13, x2: 0, y2: 8 }, k)));
  g.append(sv("line", Object.assign({ x1: -12, y1: -6, x2: 12, y2: -6 }, k)));
  g.append(sv("line", Object.assign({ x1: 0, y1: 8, x2: -9, y2: 26 }, k)));
  g.append(sv("line", Object.assign({ x1: 0, y1: 8, x2: 9, y2: 26 }, k)));
  g.append(sv("circle", { cx: 0, cy: -2, r: 10, fill: renk }));
  g.append(sv("text", { x: 0, y: 2, "text-anchor": "middle", "font-size": 11, "font-weight": 800, fill: "#fff", "font-family": "system-ui,sans-serif" }, String(o.no || "")));
  if (o.ad) g.append(sv("text", { x: 0, y: 46, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: "#fff", "font-family": "system-ui,sans-serif", stroke: "rgba(0,0,0,.45)", "stroke-width": 3, "paint-order": "stroke" }, o.ad));
  svg.append(g);
}

function okCiz(svg, ok, i) {
  const id = "ok" + i + Math.round(Math.random() * 1e6);
  const defs = sv("defs");
  const m = sv("marker", { id: id, markerWidth: 8, markerHeight: 8, refX: 6, refY: 4, orient: "auto" });
  m.append(sv("path", { d: "M0,0 L8,4 L0,8 z", fill: ok.renk || "#fde047" }));
  defs.append(m);
  svg.append(defs);
  const x1 = px(ok.a[0]), y1 = py(ok.a[1]), x2 = px(ok.b[0]), y2 = py(ok.b[1]);
  const d = ok.egri ? "M" + x1 + "," + y1 + " Q" + ((x1 + x2) / 2) + "," + (((y1 + y2) / 2) - ok.egri) + " " + x2 + "," + y2 : "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
  svg.append(sv("path", { d: d, fill: "none", stroke: ok.renk || "#fde047", "stroke-width": 4, "stroke-dasharray": ok.kesik ? "10 8" : "none", "marker-end": "url(#" + id + ")", opacity: 0.95 }));
  if (ok.not) svg.append(sv("text", { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 8, "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: "#fff", stroke: "rgba(0,0,0,.5)", "stroke-width": 3, "paint-order": "stroke", "font-family": "system-ui,sans-serif" }, ok.not));
}

// cfg: { takimlar:[{ad, renk, oyuncular:[{no,ad,x,y}]}], oklar:[{a:[x,y], b:[x,y], renk, kesik, egri, not}] }
function sahaCiz(kap, cfg) {
  const svg = sv("svg", { viewBox: "0 0 " + SW + " " + SH, role: "img", "aria-label": cfg.baslik || "Saha diyagramı" });
  sahaZemini(svg);
  (cfg.takimlar || []).forEach(function (t) { (t.oyuncular || []).forEach(function (o) { oyuncuCiz(svg, o, t.renk || "#2563EB"); }); });
  (cfg.oklar || []).forEach(function (ok, i) { okCiz(svg, ok, i); });
  kap.append(svg);
}
