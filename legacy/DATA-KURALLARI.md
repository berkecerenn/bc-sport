# BC Sport: günlük içerik güncelleme kuralları

Bu dosya, zamanlanmış görevin (ve gerektiğinde elle çalıştırılan bir Claude oturumunun) her gün izleyeceği talimattır.
Site klasörü: `C:\Users\asus\OneDrive\Desktop\Berke web sitesi\` (statik site, sunucu yok; her şey `data/*.json` dosyalarından okunur).

## 0. Altın kurallar
1. **Sadece doğrulanmış bilgi yaz.** Skor, oyuncu, dakika, bedel gibi her olgu en az iki bağımsız güvenilir kaynakta aynı olmalı. Maç sırasında alınmış anlık görüntüleri (canlı skor sayfaları) kullanma, bitmiş maçın final raporunu kullan.
2. **Kendi cümlelerinle yaz.** Haber, birden çok kaynaktan derlenip yeniden yazılır. Kaynaktan cümle kopyalama, alıntı yapacaksan tırnak içinde ve kısa tut.
3. **Uydurma yok.** Bilmediğin detayı (dakika, kim asist yaptı, bedel) yazma. "Açıklanmadı" de.
4. **Robots/erişim kısıtlarına saygı.** WebFetch/WebSearch başarısız olursa curl/wget ile dolanma; başka kaynak bul.
5. Her haberin sonunda kaynak notu otomatik çıkar (`kaynaklar` alanı). En az 3 kaynak yaz.

## 1. Her gün yapılacaklar (sırayla)
1. `data/haberler.json`, `data/maclar.json`, `data/puan.json`, `data/transferler.json` dosyalarını oku (mevcut durumu bil).
2. **Maç sonuçları** (`data/maclar.json`): Son 48 saatte biten maçları 6 lig + Şampiyonlar Ligi/Avrupa Ligi/Konferans Ligi için ekle/güncelle. Oynanmamış maçlar `skor: null`. Alan şeması dosyadaki mevcut kayıtlarla aynı (`lig, tarih, saat, ev{ad,kod}, dep{ad,kod}, skor`). Lig kodları: `super-lig, premier-lig, la-liga, serie-a, bundesliga, ligue-1, sampiyonlar-ligi, avrupa-ligi, konferans-ligi`. Tek maç için kesin saat bilinmiyorsa `saat:false`. En fazla ~40 maç tut, eskileri sil.
3. **Puan durumu** (`data/puan.json`): Her lig için güncel tabloyu al (Süper Lig için Sabah/Habertürk/TFF, diğerleri için lig sitesi ya da Wikipedia + bir ikinci kaynak). Kaynağın güncelleme tarihini `tarih` alanına yaz; tarih bugünden 3+ gün eskiyse başka kaynak dene, olmazsa tarihi olduğu gibi bırak (site tarihi gösterir). `y` = averaj, `gf` = atılan gol.
   UEFA tablolarını, biten maç sonuçlarından hesapla (3/1/0 puan, averaj, atılan gol); ligue aşaması bitince 36 takım.
4. **Haberler** (`data/haberler.json`): Bugünün 6-10 en önemli haberini yaz (Süper Lig ağırlıklı, her büyük ligden 1, Avrupa kupaları maç günlerinde 1-2, transfer/duyuru varsa 1). Aşağıdaki "Haber kalitesi" bölümüne uy. Toplam haber sayısını 30 ile sınırla, eskileri sil. `guncelleme` alanını güncel UTC zamanı yap. Manşet (`"manset": true`) tek haberde olsun: günün en büyük haberi.
5. **Transfer** (`data/transferler.json`): Transfer penceresi kapalıysa dokunma. Açık dönemde (Ocak: 1-31, Yaz: 22 Haziran - 1 Eylül civarı) yeni gelen/giden oyuncuları ekle. Bedeli sadece iki kaynakta yazıyorsa `bedel` (milyon €) ekle.
6. Kontrol: her JSON `python -m json.tool` ile geçerli mi; her `gorsel`/`foto` alanı doğru; sitede `index.html` açılıyor mu (mümkünse headless tarayıcı ile ekran görüntüsü).
7. Kısa bir özet yaz: kaç haber eklendi, hangi kaynaklar kullanıldı, neyi doğrulayamadın.

## 2. Haber kalitesi (insan muhabiri gibi)
- **Uzunluk:** maç haberleri 350-600 kelime, analiz/gündem haberleri 500-800 kelime. Kısa "flaş" haber yalnızca gerçekten kısa gelişmelerde (80-150 kelime).
- **Yapı:** güçlü başlık (fiil içeren, 60-90 karakter) → ilk paragrafta 5N1K → maçın gidişatı (golleri sırayla, dakikasıyla, ama sadece doğrulananlar) → dönüm noktası → teknik direktör/oyuncu açıklamaları (kısa, doğrudan alıntı tırnak içinde) → puan durumuna etkisi → bundan sonra ne var (sıradaki maç).
- **Derinlik:** rakamlar (seri, form, istatistik: sadece kaynaklı), önceki karşılaşma, kadro değişikliği, sakatlık/ceza. Yorum katarsan "yorum:" diye belli et, olguyla karıştırma.
- **Ton:** tarafsız, akıcı, klişe az. Taraftar dili yok.
- **Dil:** her haber TR ve EN yazılır (`baslik`, `ozet`, `govde` her ikisi de). İngilizce, Türkçenin çevirisi değil aynı olguların doğal anlatımı olsun.
- **Şema:** `id` (kısa-sabit, ör. `sl-gs-ts-2026-09-19`), `kategori`, `tarih` (UTC ISO), `baslik{tr,en}`, `ozet{tr,en}` (1-2 cümle), `govde{tr:[paragraflar],en:[paragraflar]}`, `gorsel{tr,en}` (yedek SVG yolu), `gorselAlt{tr,en}`, `foto{url,kredi,kaynakUrl}` (aşağıya bak), `kaynaklar` (ör. `["Sky Sports","Fanatik","Marca"]`).
- **Kategori kodları:** `super-lig, premier-lig, la-liga, serie-a, bundesliga, ligue-1, sampiyonlar-ligi, avrupa-ligi, konferans-ligi, transfer`.

## 3. Fotoğraf kuralı
- Yalnızca telif açısından serbest kullanımlı **Pexels** veya **Unsplash** fotoğrafları. Ajans (Getty, AP, Reuters, AA, DHA...) veya kulüp/lig fotoğrafı, kulüp logosu, oyuncu portresi **kullanma**.
- Fotoğraf sayfasını WebFetch ile aç, ID'yi doğrula. Pexels URL biçimi: `https://images.pexels.com/photos/<ID>/pexels-photo-<ID>.jpeg?auto=compress&cs=tinysrgb&w=1200`. `kredi`: `"<Fotoğrafçı> / Pexels"`, `kaynakUrl`: fotoğraf sayfası.
- Fotoğraf **temsilidir** (maçtan değil). Site bunu otomatik yazar ("Temsili görsel, maçtan değildir"). Belirli bir stadyumun gerçek fotoğrafı ancak lisansı serbestse (Pexels'te varsa) o haberde kullanılır.
- Uygun fotoğraf bulunamazsa `foto` alanını hiç yazma; `gorsel` olarak `img/haberler/varsayilan.svg` (TR) ve `img/haberler/en/varsayilan.svg` (EN) kullan.
- Site fotoğraf yüklenmezse otomatik SVG kapağa döner; bunu bozma.

## 4. Yapmaman gerekenler
- Kulüp logosu/arması, gerçek kişi fotoğrafı, ajans görseli koyma.
- Hakaret, iddia, kişisel hayat, doğrulanmamış transfer söylentisi ("bitti" diye) yazma. Söylentiyse "iddia" de ve kaynağı belirt.
- Dosya şemasını değiştirme; `js/`, `css/`, HTML dosyalarına dokunma (görev sadece `data/` ve `img/haberler/` içinde çalışır).
- Silme: bir dosyayı silmen gerekirse silme, `_to_delete/` klasörüne taşı.

## 5. Sonra: gerçek 7/24 otomasyon
Site GitHub'a ve bir barındırmaya (GitHub Pages / Cloudflare Pages) alındığında bu talimat bir GitHub Actions iş akışına taşınır (Anthropic API anahtarı repo "secret"ı olarak saklanır, bilgisayarın açık olması gerekmez).

## 6. Yeni bölümler (20 Eylül 2026 eklemeleri)
- **Fikstür ve maç merkezi (`data/fikstur.json`):** Her maç: `id` (`<lig>-<YYYY-MM-DD>-<ev-slug>-<dep-slug>`), `lig`, `hafta`, `tarih` (UTC ISO), `saatBelli`, `stat`, `sehir`, `hakem`, `var`, `yayin`, `ev{ad,kod}`, `dep{ad,kod}`, `skor` (null ya da [ev,dep]), `oncesi`/`sonrasi` ({tr:[],en:[]}), `demecler` [{kim,rol,tur:"once"|"sonra",metin:{tr,en},kaynak,url}], `konaklama`/`antrenman` ({tr,en}), `video`, `kaynaklar`. Sayfa: `mac.html?id=...`.
  Her gün: (a) oynanan maçlara skor, `sonrasi` ve maç sonu demeçleri ekle; skoru `data/maclar.json` şeridine de yaz; (b) önümüzdeki 14 günün tüm maçlarını ekle (tarih, saat, stadyum, yayıncı); hakem ataması açıklandıkça (TFF/MHK, PGMOL, DFB, Lega/AIA, RFEF, UEFA) güncelle; (c) maç günü ve öncesinde maç önü, muhtemel 11, sakatlık/ceza, takımın kaldığı otel, antrenman tesisi ve saati (biliniyorsa) ekle; (d) en önemli maçlar için resmi kulüp/lig/yayıncı YouTube kanallarından basın toplantısı videosu bul; video ID'sini yalnızca gerçekten gördüğün bağlantıdan al.
- **Video:** haber, analiz ve maç kayıtlarında `"video":[{"youtube":"ID","baslik":"...","kaynak":"..."}]`.
- **Yazar köşesi (`data/analizler.json`):** Yalnızca Berke Ceren yazar; Claude analiz YAZMAZ, sadece şablon/diyagram desteği verir. Saha diyagramı alanı `saha` (x,y 0-100, `takimlar[].oyuncular`, `oklar`). Örnek taslak `taslak:true` ile gizlidir (`kose.html?taslak=1`).
- **Lig temaları:** `css/temalar.css` (renkler yaklaşık, resmi marka renkleri değil). Lig logoları `img/ligler/<lig-kodu>.png`, takım armaları `img/logolar/<takim-slug>.png` (dosya yoksa kod rozeti görünür).
- **Milli ara:** yaklaşık 21 Eylül - 6 Ekim 2026; maçlar 9-15 Ekim'de yeniden başlıyor. Ara boyunca içerik: milli maçlar, transfer/sakatlık haberleri, analiz, ligin ilk 6 haftası özetleri.

## 7. Logo, fotoğraf, canlı skor (21 Eylül 2026 güncellemesi)
- **Logolar:** site, dosya yoksa Wikipedia'dan gerçek arma/lig logosunu tarayıcıda kendisi bulur (`logo-test.html` hangi takımların bulunamadığını gösterir). Bulunamayanlar için elle `img/logolar/<slug>.png` veya `img/ligler/<lig-kodu>.png` konur.
- **Haber fotoğrafı:** `fotoAra` (dizi) alanı: Wikipedia/Commons arama adayları (stadyum adı, lig adı). Lisans ve fotoğrafçı adı sitede otomatik gösterilir. `foto` (Pexels) ikinci yedektir.
- **Canlı skor:** `data/maclar.json` içinde oynanan maça `"canli": true, "dakika": "67'"` ve güncel `skor` yazılır; maç bitince `canli` silinir. Site her 30 sn'de dosyayı yeniden okur. Fikstürde aynı alanlar mac.html'de gösterilir.
- **Video:** `video[].url` alanına YouTube bağlantısı yapıştırmak yeterlidir.

## 8. Yeni ligler ve canlı puan durumu (21 Eylül 2026)
- Kapsanan ligler (kodlar): `liga-portugal, eredivisie, belcika-ligi, norvec-ligi, iskocya-ligi, danimarka-ligi` (Süper Lig + 5 büyük lig + 3 UEFA ile birlikte 15 kategori). Yeni bir lig eklemek için: `index.html` düğmesi, `js/app.js` MAC_LIGLERI, `js/ortak.js` LIG_BILGI/LIG_ARAMA/menuCiz listesi, `js/i18n.js` kat.* (TR+EN), `css/temalar.css` renk teması.
- **Canlı puan durumu:** `puan-durumu.html`, `maclar.json` içindeki `canli:true` maçları tabloya anlık işler. Bu yüzden `puan.json` tablosuna, o an oynanan maçları EKLEME (bitince ekle ve `canli` alanını sil).
- Canlı skor gerçek zamanlı bir kaynaktan otomatik gelmez; dosyayı güncelleyen kişi/görev yazar. Google sonuçlarından otomatik çekmek mümkün değil (izin yok, tarayıcı engeller); ileride ücretsiz bir skor API'si bağlanabilir.
- **Doğrulama:** ajan çıktıları mutlaka ikinci bir modelle/kaynakla kontrol edilir (zayıf model tablo ve teknik direktör adlarını uydurabiliyor; 21 Eylül'de Eredivisie'de yaşandı).
- **Örnek analiz:** `analizler.json` içinde `ornek:true` işaretli Claude taslağı vardır; Berke düzeltip kendi imzasıyla yayınlar ya da siler.
