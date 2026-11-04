# Dikey Haber Videosu: Güllü'nün oğlu hakkında suç duyurusu

Kaynak haber: https://www.haberler.com/magazin/gullunun-oglu-hakkinda-suc-duyurusu-yapay-zeka-20394705-haberi/

- **Format:** 1080x1920 (9:16), 30 fps, tam **30 saniye**, H.264 + AAC
- **Kanca (0–5 sn):** beyaz flaş, patlama sesi, titreyen "YAPAY ZEKAYA SORULAN **2 SORU** / SORUŞTURMAYI DEĞİŞTİRİR Mİ?" başlığı
- **Grafikler:** SON DAKİKA bandı, ilerleme çubuğu, isim alt bandı (lower third), "Suç duyurusu" kartı,
  delil teslim süreci akış şeması, yapay zekâ sohbet balonu, "İDDİA ≠ KANIT" kapanışı, kayan GÜNDEM bandı
- **Alt yazı:** kelime kelime senkron, konuşulan kelime sarı (karaoke stili)
- **Anlatıcı:** sağ altta yuvarlak webcam, sese göre nabız atan kırmızı halka ve "ANLATICI" etiketi
- **Müzik / efektler:** kodla üretilmiştir (`make_music`), dışarıdan alınmış hiçbir ses yok, yani telif riski yok
- **Görsel:** haberin kendi görseli, üzerinde "Kaynak / Görsel: Haberler.com" ibaresiyle

`cikti/haber_video.mp4` dosyası **demo sürümdür**: geçici bir Türkçe TTS sesi ve kamera yer tutucusu kullanır.

## Kendi sesin ve yüzünle üretmek

1. `script.txt` dosyasını kameraya bakarak oku (yaklaşık 29–30 sn). Her satır bir sahnedir, satır aralarında kısa bir nefes bırak.
2. Kaydı bu klasöre koy (ör. `kaydim.mp4`; yatay ya da dikey olabilir, yüz otomatik ortalanıp daireye kırpılır).
3. Çalıştır:

```bash
pip install pillow numpy      # ffmpeg de kurulu olmalı
python3 build.py --webcam kaydim.mp4
```

Hem görüntü hem ses kayıttan alınır. Alt yazı zamanlaması, konuşmanın başlangıç ve bitişi bulunarak
kelime uzunluğuna göre dağıtılır.

Faydalı seçenekler:

| Seçenek | Açıklama |
|---|---|
| `--webcam-start 1.2` | Kayıtta konuşma 1.2 sn'de başlıyorsa baştaki boşluğu keser |
| `--mirror` | Kamerayı aynalar |
| `--audio ses.wav` | Görüntü ile ses ayrı dosyadaysa |
| `--music-gain 0.15` | Altlık müziğin seviyesi (varsayılan 0.22) |
| `--preview 1,9,20` | Bu saniyelerde PNG önizleme kaydeder |
| `--out cikti/x.mp4` | Çıktı yolu |

## Dosyalar

- `build.py`: tüm render hattı (PIL ile kare çizimi ve ffmpeg ile kodlama/bindirme)
- `script.txt`: seslendirme metni (5 satır = 5 sahne)
- `assets/haber_gorseli.jpg`: haber görseli
- `assets/demo_ses.mp3`, `assets/demo_kelimeler.json`: demo TTS sesi ve kelime zamanlamaları
- `assets/fonts/`: Inter yazı tipi (SIL Open Font License)

## Hukuki not

Metin, haberdeki ifadelere sadık kalır ("iddia", "öne sürüldü") ve kapanışta suç duyurusunun suçun
kanıtlandığı anlamına gelmediği açıkça söylenir. Haber görseli Haberler.com'a aittir; video
"no copyright" olarak etiketlenmemiştir, kaynak gösterilmiştir. Platformda tamamen telifsiz görsel
gerekiyorsa `--image` ile kendi görselini verebilirsin.
