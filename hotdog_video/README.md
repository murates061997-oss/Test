# Dad Dogs Again — hot dog arabası hikâyesi (animasyonlu video)

`audio/voice.mp3` anlatımından (İngilizce, ~9:50) üretilmiş 1920×1080 yatay video: **`hotdog_cart.mp4`**.

Tüm görseller harici bir yapay zekâ görsel üreticisi kullanılmadan, HTML canvas üzerinde kodla çizilir
(beyaz yuvarlak kafalı karakterler, mürekkep konturlar, kırmızı önlük, tuğla duvar/sarkıt lamba — referans
ekran görüntüsündeki tasarım dili). Müzik de tamamen sentezlenmiştir (telifsiz).

| Dosya | Görev |
|---|---|
| `lib.js` | Çizim kütüphanesi: karakter (`person`), sosisli arabası, tabela, menü, sosisli, rozet/balon vb. |
| `scenes1.js` `scenes2.js` `scenes3.js` | Anlatımla zamanlanmış ~45 sahne (saniye cinsinden) |
| `index.html` | Sahne motoru, çapraz geçişler, altyazı, film greni; tarayıcıda açınca sesle birlikte oynar (`?t=120` ile ileri sar) |
| `render.js` | Playwright ile kare kare render (paralel), ffmpeg ile ses + müzik miksajı |
| `audio/transcript.json` | Whisper (yerel, açık kaynak) ile kelime zamanlı transkript |
| `audio/build_captions.py` | Transkriptten kısa altyazı parçaları (`captions.js`) |
| `audio/build_music.py` | Fon müziği sentezi (`music.wav`) |
| `fonts/` | Patrick Hand, Fredoka (SIL OFL) |

Yeniden üretmek için:

```bash
python3 audio/build_captions.py
python3 audio/build_music.py
node render.js            # -> hotdog_cart.mp4
node render.js --stills 10,120,300 kareler/   # kontrol kareleri
```
