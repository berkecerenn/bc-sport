# Futbol Gündemi: Yol Haritası (Öğren + Portfolyo)

Güncelleme: 19 Eylül 2026
Yaklaşım: Saf HTML/CSS/JS ile başla, admin paneli aşamasında Supabase ekle, istersen sonra framework'e geç.
Amaç: Hem gerçek bir haber/analiz sitesi hem de portfolyoda gösterilecek bir proje.

---

## 1. Çalışma Şeklimiz

Her aşamada aynı üç adımı izliyoruz:

1. **Kavram:** Ne yapacağız ve neden? (kısa, sade)
2. **Kod:** Birlikte yazıyoruz, ben açıklıyorum, sen çalıştırıp deniyorsun.
3. **Alıştırma:** Öğrendiğini küçük bir görevle gösteriyorsun (ör. "yeni bir dil ekle", "yeni bir grafik ekle"). Ben kontrol ediyorum.

Her aşamanın sonunda bir "portfolyo notu" yazarız (ne yaptık, ne öğrendik, ekran görüntüsü). Böylece portfolyo yazısı zamanla kendiliğinden birikir.

---

## 2. Aşamalar

| Aşama | İçerik | Öğreneceklerin |
|---|---|---|
| **0. Temel (bitti)** | Ana sayfa, kategori filtresi, haber detay sayfası, 10 özgün haber, SVG görseller | HTML, CSS, JS, JSON, fetch, DOM |
| **1. Dil seçeneği (şimdi)** | Türkçe/İngilizce arayüz, iki dilli haberler, dil hatırlama | Çok dillilik (i18n), localStorage, olaylar |
| **2. Haber sitesi arayüzü** | Büyük spor sitelerinin ortak düzeni: manşet + yan şerit, "En çok okunanlar", sabit üst menü, arama, koyu tema düğmesi | CSS Grid/Flexbox, tasarım sistemi, erişilebilirlik |
| **3. Grafikler ve maç analizi** | Puan durumu, xG karşılaştırması, gol dağılımı, maç analizi sayfası şablonu | Chart.js veya D3, veri görselleştirme |
| **4. Blog / yazılar** | Uzun analiz yazıları, yazar kutusu, etiketler | Markdown, şablon sayfalar, SEO |
| **5. Harita** | Avrupa/Dünya haritası, ülke üstüne gelince vurgu, tıklayınca o ülkenin takımları, takıma tıklayınca haberleri | SVG, TopoJSON, D3-geo, etkileşim |
| **6. Veri ve otomasyon** | RSS/API'den veri toplama, otomatik güncelleme | Node.js, API, GitHub Actions |
| **7. Admin paneli ve veritabanı** | Giriş, haber ekle/düzenle/yayınla, görsel yükle | Supabase (Postgres + giriş sistemi + depolama), CRUD, yetkilendirme |
| **8. Yayın ve profesyonelleşme** | Hosting, alan adı, SEO, analitik, performans, gizlilik/çerez | Deploy, Lighthouse, GDPR |
| **9. Portfolyo paketi** | README, ekran görüntüleri, vaka çalışması, demo | Anlatım, sunum |

---

## 3. Bir Haber Sitesi İçin Neler Gerekir? (Kontrol Listesi)

**İçerik tarafı**
- **Admin paneli (CMS):** Haberi ekleme, düzenleme, taslak/yayın durumu, zamanlama, görsel yükleme. (Aşama 7)
- **Veritabanı:** Haberler, yazarlar, kategoriler, takımlar. Şimdiki `haberler.json` bunun basit hâli.
- **Roller ve giriş:** Yönetici, editör, yazar gibi farklı yetkiler. Şifre asla kodda tutulmaz.
- **Medya depolama:** Görseller için ayrı bir depo ve boyutlandırma.
- **Çok dillilik:** Her haberin TR/EN sürümü. (Aşama 1)

**Okuyucu tarafı**
- **Arama, kategori/etiket sayfaları, "en çok okunanlar", ilgili haberler.**
- **Paylaşım düğmeleri, kendi RSS akışımız, e-bülten.**
- **Koyu tema, mobil uyum, erişilebilirlik** (klavye, alt metin, kontrast).

**Teknik ve görünürlük**
- **SEO:** Sayfa başlığı, açıklama, Open Graph, `sitemap.xml`, `robots.txt`, haber için NewsArticle yapılandırılmış verisi.
- **Performans:** Hızlı yükleme (Lighthouse 90+), görsel optimizasyonu.
- **Analitik:** Hangi haber okunuyor? (gizlilik dostu araç tercih edilir)
- **Güvenlik:** Kullanıcıdan/dışarıdan gelen metni güvenli basmak (XSS), admin girişi, gizli anahtarlar.
- **Yedekleme ve izleme.**

**Hukuki (Portekiz/AB'de olduğun için GDPR geçerli)**
- Gizlilik politikası, çerez bildirimi (analitik/reklam eklenirse), iletişim/künye sayfası.
- Telif: özgün metin, kendi görseller, kaynak notu. Şikayet halinde hızlı kaldırma yolu.
- Kişisel veri (bülten e-postaları vb.) için saklama ve silme kuralları.

---

## 4. Büyük Spor Sitelerinden Ne Alacağız? (Tasarım Notu)

Aşama 2'de tek tek site kopyalamayacağız; **ortak kalıpları** kendi tasarımımıza uyarlayacağız. Düzen fikirleri serbesttir, marka, logo, renk ve kodları kopyalamak serbest değildir. Ortak kalıplar:

- Üstte sabit menü + lig şeridi (ligler arası hızlı geçiş)
- Sol/orta büyük manşet, sağda "Son dakika" veya "En çok okunanlar" listesi
- Kategori bazlı bloklar (Süper Lig, Premier Lig...)
- Skor/puan durumu şeridi veya kutusu
- Okunaklı, geniş satır aralıklı makale sayfası, ilgili haberler

Hangi sitelerden esinleneceğini birlikte seçeriz; sen 3-4 site söylersen düzenlerini inceleyip özetleyebilirim.

---

## 5. Takım Logoları: Riski Yöneten Yaklaşım

**Gerçek durum:** Kulüp logoları hem **telif** hem **marka** hakkıyla korunur. Bu ikisi ayrı şeylerdir: bir logo "telifsiz" olsa bile marka olarak korunuyor olabilir. Bulduklarım:

- Kulüpler izin sürecini ayrı yönetiyor. Örneğin Liverpool FC, ticari kullanım ve bireysel/ticari olmayan kullanım için farklı e-posta adresleri gösteriyor.
- Futbol API'leri logo bağlantısı verebilir (football-data.org'un takım verisinde `crest` alanı var), ancak dokümantasyonda **bu görsellerin lisansına dair bir bilgi yok**. Yani API'den gelmesi, kullanım hakkı verdiği anlamına gelmez.
- Hukuki soru-cevap kaynakları, yalnızca **takım adlarını** olgusal bilgi için kullanmanın logo kullanımından daha savunulabilir olduğunu söylüyor. Logoda ise "adil kullanım" tartışmalı bir yargı meselesi. Bu kaynakların çoğu ABD/İngiltere hukukuna göre, sen ise AB'desin.

*Ben avukat değilim. Yayına açık bir sitede gerçek logo kullanacaksan Portekiz/AB hukukunu bilen bir uzmana danışmalısın.*

**Sistemi şöyle kuruyoruz (Aşama 5):**

Her takımın verisinde bir `logo` alanı olacak. Alan boşsa site otomatik olarak **kendi tasarımımız rozeti** (takım renkleri + kısaltma) çizer. Böylece harita hemen çalışır ve logo kararı sonradan, kodu bozmadan verilir.

Gerçek logoya geçiş için kademeler:
1. **Varsayılan:** Kendi rozetlerimiz. Risk yok, yayında güvenle durur.
2. **Yerel demo:** Logoları sadece kendi bilgisayarında (localhost) gösterip ekran kaydı/GIF ile portfolyoya koymak. Yayına açık siteye koymak farklı bir risktir.
3. **İzin:** İlgili kulüplerin marka/lisans birimlerine "ticari olmayan portfolyo/eğitim projesi" diye yazıp yazılı izin istemek. İzin gelen kulübün logosu açılır.
4. **Lisanslı veri sağlayıcı:** Logo kullanım hakkını açıkça veren bir futbol veri sağlayıcısının şartlarını okuyup değerlendirmek.

---

## 6. Portfolyo Notları

- **Kod dili:** Şu an değişken ve dosya adları Türkçe (öğrenirken anlaşılır). Portfolyoyu uluslararası kişilere de göstereceksen Aşama 8'de kod adlarını İngilizceye çeviririz (küçük bir yeniden düzenleme, iyi bir alıştırma).
- **Vaka çalışması fikri:** "Sıfırdan iki dilli bir spor haber platformu: harita, grafik, admin paneli." Sporda dijital içerik ve hayran etkileşimi rollerine giden bir portfolyo için harita ve grafikli analiz sayfaları güçlü bir vitrin olur.
- **Herkese açık depo:** Kodu GitHub'a koyup README ve canlı demo bağlantısı eklemek, portfolyonun en görünür parçası olur.

---

## 7. Bilinen Riskler

| Risk | Önlem |
|---|---|
| Çok fazla özellik, bitmeyen proje | Her aşama küçük ve çalışır çıktı verir; sıra değiştirilebilir |
| Logo/marka şikayeti | Varsayılan rozet, izinli logo, avukat görüşü |
| Haber doğruluğu | Birden çok kaynaktan doğrulama, kaynak notu, tek kaynaklı haberi işaretleme |
| Saf JS ile büyük sitede kod karmaşası | Ortak dosyalar, aşama 8'de gerekirse framework'e geçiş |
| Admin panelinde güvenlik açığı | Hazır kimlik doğrulama (Supabase), satır düzeyinde yetki kuralları |

---

## Sıradaki Adım

**Aşama 1: Türkçe/İngilizce dil seçeneği.** Dil düğmesi, iki dilli arayüz, iki dilli haberler ve görseller.

*Kaynaklar (logo araştırması):* [Liverpool FC logo izin sayfası](https://faq.liverpoolfc.com/articles/fan-mail-special-requests/request-to-use-logo-or-crest/65969c1d74e6ff44331e5653), [football-data.org takım dokümantasyonu](https://docs.football-data.org/general/v4/team.html), [Justia hukuki soru-cevap](https://answers.justia.com/question/2024/04/24/under-what-conditions-can-we-use-soccer-1011586), [Live Score API logo yazısı](https://live-score-api.com/posts/254-the-benefits-of-using-team-logos-on-your-football-app-or-website)
