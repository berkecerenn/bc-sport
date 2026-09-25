# Futbol Haber Sitesi: Detaylı Plan

Hazırlanma tarihi: 19 Eylül 2026
Kapsam: Genel futbol haberleri, RSS/API ile otomatik haber akışı, kendi yazacağın HTML/JS kodu.

---

## 1. Proje Özeti

Türkiye ve dünya futbolundan haberleri tek yerde toplayan, hızlı ve sade bir haber sitesi. Haberler ilgili kaynakların RSS akışlarından otomatik çekilir; sitede başlık, kısa özet, görsel ve **kaynağa giden bağlantı** gösterilir. Site statik dosyalardan oluşur, bu yüzden hosting ücretsiz veya çok ucuzdur.

**Hedefler**
- Ziyaretçi siteyi açtığında en güncel haberleri saniyeler içinde görsün.
- Sen her gün elle haber girmeden site kendi kendine güncellensin.
- Mobilde sorunsuz çalışsın (futbol okurunun çoğu telefondan gelir).
- Zamanla Google'dan trafik alabilecek SEO temeli olsun.

---

## 2. En Önemli Teknik Karar: Statik Site Haberi Nasıl Çeker?

Salt HTML/JS ile tarayıcıdan doğrudan RSS okumak çoğu zaman **CORS hatası** verir; haber siteleri başka sitelerin kendi akışlarını tarayıcıda okumasına izin vermez. Ayrıca API anahtarlarını tarayıcı koduna koymak güvenli değildir.

**Önerilen çözüm: Zamanlanmış "toplayıcı" script**

1. Küçük bir Node.js (veya Python) script'i RSS kaynaklarını çeker.
2. Sonuçları temizleyip tek bir `haberler.json` dosyasına yazar.
3. Bu script **GitHub Actions** ile her 15-30 dakikada bir otomatik çalışır.
4. Site (HTML/JS) sadece bu JSON dosyasını okuyup ekrana basar.

Böylece siteniz saf HTML/JS kalır, CORS sorunu olmaz, anahtarlar gizli kalır ve sunucu kiralamana gerek kalmaz.

```
[RSS kaynakları] --> [GitHub Actions: toplayici.js] --> haberler.json --> [Site: HTML/JS] --> Ziyaretçi
     (15-30 dk'da bir)         (temizle, birleştir, tekrarları ele)
```

---

## 3. Sayfa Yapısı

| Sayfa | Amaç |
|---|---|
| Ana sayfa | Manşet (öne çıkan haber), son haberler ızgarası, kategori kısayolları |
| Kategori sayfaları | Süper Lig, Transfer, Avrupa, Dünya, Milli Takım |
| Haber kartı / detay | Başlık, görsel, kısa özet, "Devamını kaynakta oku" bağlantısı |
| Puan durumu | Süper Lig (ve isteğe bağlı diğer ligler) puan tablosu |
| Fikstür / sonuçlar | Haftalık maçlar ve skorlar |
| Arama | Başlıklarda istemci tarafı arama |
| Hakkında / İletişim / Gizlilik | Hukuki ve güven sayfaları (reklam ve çerez için gerekli) |

---

## 4. Özellikler (Öncelik Sırasıyla)

**MVP (ilk sürüm)**
- Otomatik haber akışı (3-5 kaynak)
- Ana sayfa + kategori filtresi
- Mobil uyumlu, hızlı tasarım
- Açık / koyu tema
- "Kaynağa git" bağlantıları

**Sürüm 2**
- Süper Lig puan durumu ve fikstür (API ile)
- Arama kutusu
- Takım bazlı filtre (Galatasaray, Fenerbahçe, Beşiktaş, Trabzonspor…)
- Sayfalama / "Daha fazla yükle"

**Sonra**
- Bülten (e-posta) aboneliği
- Sosyal medya paylaşım düğmeleri
- Tarayıcı bildirimi (PWA)
- Kendi yazdığın özgün yazılar bölümü (Markdown'dan üretilen sayfalar)
- Basit reklam alanları

---

## 5. Haber Kaynakları

Hangi kaynağın RSS'i açık, hangisinin kullanım şartı neye izin veriyor, **kaynak eklemeden önce tek tek kontrol edilmeli**. RSS akışlarının adresleri zamanla değişebilir.

**Kaynak seçerken kriterler**
- Sitenin resmi bir RSS/feed adresi var mı? (Genelde `/rss`, `/feed` veya "RSS" simgesi altındadır)
- Kullanım şartları başlık + kısa özet + link kullanımına izin veriyor mu?
- Akış düzenli güncelleniyor mu?

**Aday türleri**
- Türkiye: büyük spor gazetelerinin ve spor portallarının spor bölümü RSS'leri, kulüplerin resmi haber akışları
- Uluslararası: BBC Sport Football, Guardian Football, Sky Sports gibi yayıncıların futbol RSS'leri
- Toplu liste bulmak için: RSS dizin siteleri (ör. Feedspot) ve her sitenin kendi RSS sayfası

**Puan durumu / fikstür için API**
- football-data.org gibi ücretsiz katman sunan servisler var. Ücretsiz katmanlarda **dakikada istek sınırı** ve **kapsanan lig sayısı sınırı** olur; Süper Lig'in ücretsiz pakette olup olmadığını kayıt olmadan önce güncel fiyat sayfasından doğrula.
- Alternatif olarak API-Football (ücretsiz anahtar, günlük istek limiti).
- API çağrıları da tarayıcıdan değil, aynı GitHub Actions script'inden yapılıp JSON'a yazılmalı (anahtar gizli kalır, limit aşılmaz).

---

## 6. Telif ve Hukuki Çerçeve (Atlanmaması Gereken Kısım)

Otomatik haber sitelerinin en büyük riski budur.

- **Tam metni kopyalama.** Yalnızca başlık, 1-2 cümlelik özet ve kaynağa link göster.
- **Görseller:** Kaynağın görselini izinsiz kendi sunucuna kopyalama. Mümkünse RSS'in verdiği görsele doğrudan bağlantı ver veya görselsiz/varsayılan görselli kart kullan.
- **Kaynağı açıkça belirt:** Her kartta kaynak adı ve orijinal habere link olsun.
- **Kullanım şartlarını oku:** Bazı siteler RSS'in ticari kullanımını yasaklar. Reklam koymayı düşünüyorsan bu çok önemli.
- **Gizlilik / çerez:** Reklam veya analitik eklersen KVKK ve (AB ziyaretçisi varsa) GDPR uyumlu bir gizlilik sayfası ve çerez bildirimi gerekir.
- Kendi özgün yazıların, telif açısından en güvenli ve SEO açısından en değerli içeriktir; uzun vadede karışıma eklemeni öneririm.

*Not: Ben hukuk danışmanı değilim; ticari gelir planlıyorsan yayına almadan önce bir uzmana danışmak iyi olur.*

---

## 7. Teknik Mimari ve Klasör Yapısı

**Teknolojiler:** HTML5, CSS3 (CSS değişkenleri ile tema), vanilla JavaScript. Toplayıcı script için Node.js.

```
Berke web sitesi/
├── index.html              # Ana sayfa
├── kategori.html           # Kategori sayfası (?k=super-lig)
├── puan-durumu.html
├── fikstur.html
├── hakkinda.html
├── gizlilik.html
├── css/
│   └── stil.css
├── js/
│   ├── app.js              # haberler.json'u okur, kartları çizer
│   ├── filtre.js           # kategori / takım / arama
│   └── tema.js             # açık-koyu tema
├── data/
│   ├── haberler.json       # otomatik üretilir
│   ├── puan-durumu.json    # otomatik üretilir
│   └── fikstur.json        # otomatik üretilir
├── scripts/
│   ├── kaynaklar.json      # RSS listesi ve kategori eşlemeleri
│   └── toplayici.js        # RSS/API çekip data/*.json yazar
├── .github/workflows/
│   └── guncelle.yml        # Zamanlanmış çalıştırma
└── img/                    # logo, varsayılan görseller
```

**`haberler.json` örnek şeması**

```json
{
  "guncelleme": "2026-09-19T14:30:00Z",
  "haberler": [
    {
      "id": "kaynak-hash",
      "baslik": "…",
      "ozet": "…(en fazla ~200 karakter)",
      "link": "https://kaynak.com/haber",
      "gorsel": "https://…",
      "kaynak": "Kaynak Adı",
      "kategori": "super-lig",
      "takimlar": ["galatasaray"],
      "tarih": "2026-09-19T13:05:00Z"
    }
  ]
}
```

**Toplayıcı script'in işleri**
1. `kaynaklar.json`'daki her RSS'i çek (hata olursa o kaynağı atla, diğerleri devam etsin)
2. Başlık/özeti temizle (HTML etiketlerini sil, kısalt)
3. Tekrar eden haberleri ele (aynı link veya çok benzer başlık)
4. Anahtar kelimelerle kategori ve takım etiketle (ör. "transfer", "Galatasaray")
5. Tarihe göre sırala, son ~200 haberi `haberler.json`'a yaz

---

## 8. Hosting ve Yayına Alma

| Seçenek | Maliyet | Not |
|---|---|---|
| GitHub Pages | Ücretsiz | Actions ile en kolay entegrasyon; kendi alan adını bağlayabilirsin |
| Cloudflare Pages | Ücretsiz | Hızlı CDN, GitHub'a bağlanıyor, genelde geniş ücretsiz limit |
| Netlify | Ücretsiz katman | Benzer mantık |

**Öneri:** GitHub Pages veya Cloudflare Pages. Her ikisinde de yeni haber JSON'u commit edilince site otomatik güncellenir.

**Alan adı:** Yıllık yaklaşık 10-15 USD (`.com`), Türkiye için `.com.tr` şartları farklıdır. İsteğe bağlı ama profesyonel görünüm için önerilir.

---

## 9. SEO ve Performans

- Anlamlı `<title>` ve `<meta description>` her sayfada
- `sitemap.xml` ve `robots.txt`
- Open Graph etiketleri (sosyal medyada paylaşım önizlemesi)
- Görsellerde `loading="lazy"`, sabit boyutlar (sayfa zıplamasın)
- Tek bir küçük JS + CSS; hedef: Lighthouse 90+
- **Bilinen sınırlama:** İstemci tarafında JSON'la çizilen içerik arama motorları için statik HTML kadar iyi indekslenmez. Çözüm: toplayıcı script'i haber kartlarını doğrudan HTML dosyalarına da gömecek şekilde genişletmek (Sürüm 2). Bu, SEO'yu ciddi biçimde iyileştirir.

---

## 10. Gelir Modeli (İsteğe Bağlı)

- Google AdSense: Yeterli özgün içerik ve gizlilik sayfaları olmadan onay zor. Sadece linkleyen otomatik siteler çoğu zaman reddedilir.
- Bağlı kuruluş (affiliate): forma, bilet, yayın platformu bağlantıları
- Bülten sponsorluğu
- Önce trafik ve özgün içerik, sonra gelir.

---

## 11. Takvim (Haftalık Tempoda Örnek)

| Hafta | Yapılacak |
|---|---|
| 1 | Marka/isim, renk paleti, sayfa taslakları; kaynak listesi ve kullanım şartları kontrolü |
| 2 | HTML/CSS iskelet, ana sayfa, kart tasarımı, mobil uyum, tema |
| 3 | `toplayici.js` yazımı, `haberler.json` üretimi, kategori/takım etiketleme |
| 4 | GitHub repo, Actions zamanlaması, hosting, alan adı, ilk yayın (MVP) |
| 5 | Puan durumu ve fikstür (API), arama, takım filtresi |
| 6 | SEO (sitemap, meta, statik HTML üretimi), Lighthouse iyileştirmeleri, analitik |
| 7+ | Bülten, özgün yazı bölümü, reklam/gelir denemeleri |

---

## 12. Maliyet Özeti

| Kalem | Tahmini |
|---|---|
| Hosting (GitHub/Cloudflare Pages) | 0 |
| GitHub Actions (küçük iş) | 0 (ücretsiz limit içinde) |
| RSS kaynakları | 0 |
| Futbol API (ücretsiz katman) | 0 |
| Alan adı (isteğe bağlı) | ~10-15 USD/yıl |
| **Toplam başlangıç** | **0 - 15 USD** |

Yoğun trafik veya canlı skor istersen ücretli API katmanı gerekir (aylık birkaç on USD'den başlar).

---

## 13. Riskler ve Önlemler

| Risk | Önlem |
|---|---|
| Kaynak RSS'i değişir/kapanır | Çoklu kaynak; script hatayı yutar, diğerleri çalışır; aylık kontrol |
| Telif şikayeti | Sadece başlık + kısa özet + link; kaynak gösterimi; şikayette hızlı kaldırma yolu |
| API limit aşımı | Sadece script çağırır, tarayıcı çağırmaz; sonuçları önbelleğe alır |
| Aynı haber tekrar tekrar görünür | Link/başlık benzerliğiyle tekilleştirme |
| SEO zayıf kalır | Statik HTML üretimi + özgün içerik |
| GitHub Actions zamanlaması gecikebilir | Kritik canlı skor için uygun değil; "son güncelleme" saatini sitede göster |

---

## 14. Sonraki Adımlar

1. Site adı ve marka yönünü belirle (isim, renk, logo fikri).
2. 5-8 aday RSS kaynağı seç; kullanım şartlarını ve RSS adreslerini doğrula.
3. Bir GitHub hesabı ve yeni bir depo (repo) aç.
4. İlk somut iş: klasörde `index.html` + `stil.css` iskeleti ve örnek `haberler.json` ile tasarımı gör.
5. Ardından `toplayici.js` ve zamanlanmış otomasyonu kur.

**Cevaplanması gereken açık sorular**
- Site adı ne olacak? Bir alan adın var mı?
- Sadece Türkçe mi, yoksa yabancı kaynaklı haberler (İngilizce başlıklar) de olacak mı?
- Gelir düşünüyor musun, yoksa hobi/portfolyo mu?
- Belirli bir takım veya lige ağırlık vermek istiyor musun?
