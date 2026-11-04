#!/usr/bin/env python3
"""Dikey (1080x1920) 30 saniyelik haber videosu üretici.

Kullanım (kendi kaydınla):
    python3 build.py --webcam kaydim.mp4
Demo (geçici TTS sesi + yer tutucu kamera):
    python3 build.py
Ayrıntılar için README.md.
"""
import argparse
import json
import math
import os
import re
import subprocess
import sys
import tempfile
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")

W, H, FPS = 1080, 1920, 30
DUR = 30.0

# Renkler
RED = (227, 6, 19)
YEL = (255, 210, 0)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
NAVY = (14, 20, 34)

# Yerleşim
TOP_H = 130
CARD_Y, CARD_H = 150, 760
PANEL_Y = 935
SUB_Y = 1288
CAM_D = 350
CAM_X, CAM_Y = W - 50 - CAM_D, 1410
TICKER_Y, TICKER_H = 1806, 78

SOURCE = "Kaynak / Görsel: Haberler.com"
TICKER = ("Güllü soruşturmasında yeni gelişme   •   Oğlu hakkında suç duyurusu   •   "
          "İddialar henüz kanıtlanmadı, soruşturma sürüyor   •   ")


# ---------------------------------------------------------------- yardımcılar
_fonts = {}


def font(weight, size):
    key = (weight, size)
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(os.path.join(ASSETS, "fonts", f"Inter-{weight}.otf"), size)
    return _fonts[key]


def tr_upper(s):
    return s.replace("i", "İ").replace("ı", "I").upper()


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_back(x):
    x = clamp(x)
    c = 1.7
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2


def text_w(f, s):
    return f.getbbox(s)[2] - f.getbbox(s)[0]


def wrap(s, f, maxw):
    lines, cur = [], ""
    for w in s.split():
        t = (cur + " " + w).strip()
        if text_w(f, t) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def with_alpha(layer, k):
    if k >= 0.999:
        return layer
    a = layer.getchannel("A").point(lambda v: int(v * k))
    out = layer.copy()
    out.putalpha(a)
    return out


def tokens(s):
    return re.findall(r"[^\W_]+(?:['’][^\W_]+)?", s)


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


# ---------------------------------------------------------------- ses / zamanlama
def audio_duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def audio_levels(path, n_frames):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", "16000",
                          "-f", "s16le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    hop = 16000 // FPS
    lv = np.zeros(n_frames)
    for i in range(n_frames):
        seg = x[i * hop:(i + 1) * hop]
        if len(seg):
            lv[i] = math.sqrt(float(np.mean(seg ** 2)))
    if lv.max() > 0:
        lv = np.clip(lv / (np.percentile(lv, 95) + 1e-6), 0, 1)
    return lv


def speech_span(path):
    """Konuşmanın başladığı ve bittiği anı sessizlik analiziyle bulur."""
    err = subprocess.run(["ffmpeg", "-v", "info", "-i", path, "-af",
                          "silencedetect=noise=-35dB:d=0.25", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    dur = audio_duration(path)
    starts = [float(v) for v in re.findall(r"silence_start: ([\d.]+)", err)]
    ends = [float(v) for v in re.findall(r"silence_end: ([\d.]+)", err)]
    begin = ends[0] if starts and starts[0] < 0.05 and ends else 0.0
    finish = dur
    if starts and starts[-1] > begin + 1 and (len(ends) < len(starts)):
        finish = starts[-1]
    return begin, min(finish, DUR)


def word_timings(sentences, audio, words_json):
    words = []
    for si, s in enumerate(sentences):
        for t in tokens(s):
            words.append({"w": t, "si": si})
    if words_json and os.path.exists(words_json):
        data = json.load(open(words_json, encoding="utf-8"))
        if len(data) == len(words):
            for w, d in zip(words, data):
                w["s"], w["e"] = d["s"], d["e"]
            return words
        print(f"! {words_json} kelime sayısı uyuşmuyor ({len(data)} != {len(words)}), "
              "orantılı zamanlama kullanılıyor", file=sys.stderr)
    # Orantılı zamanlama: konuşma süresini harf uzunluğuna ve cümle aralarına göre böl.
    begin, finish = speech_span(audio)
    weights = []
    for i, w in enumerate(words):
        pause = 6 if i + 1 < len(words) and words[i + 1]["si"] != w["si"] else 0
        weights.append(len(w["w"]) + 2 + pause)
    total = sum(weights)
    t = begin
    for w, wt in zip(words, weights):
        span = (finish - begin) * wt / total
        w["s"] = t
        w["e"] = t + span * (len(w["w"]) + 2) / wt
        t += span
    return words


def make_music(path, scene_starts):
    """Telif içermeyen, kodla üretilmiş haber altlığı (pad + nabız + geçiş efektleri)."""
    sr = 44100
    n = int(sr * DUR)
    t = np.arange(n) / sr
    rng = np.random.default_rng(7)
    lfo = 0.6 + 0.4 * np.sin(2 * np.pi * 0.12 * t)
    pad = sum(np.sin(2 * np.pi * f * t) * a for f, a in [(55, .5), (110, .35), (164.8, .18), (220, .12), (261.6, .08)])
    out = 0.10 * pad * lfo
    beat = 0.5
    for k in range(int(DUR / beat)):
        s = int(k * beat * sr)
        m = min(n - s, int(0.35 * sr))
        tt = np.arange(m) / sr
        kick = np.sin(2 * np.pi * (48 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9)
        out[s:s + m] += 0.22 * kick
        hs = int((k * beat + beat / 2) * sr)
        hm = min(n - hs, int(0.04 * sr))
        if hm > 0:
            out[hs:hs + hm] += 0.03 * rng.standard_normal(hm) * np.exp(-np.arange(hm) / sr * 120)

    def whoosh(at, length=0.6, gain=0.25):
        s = int(at * sr)
        m = min(n - s, int(length * sr))
        if m <= 0:
            return
        noise = rng.standard_normal(m)
        k = 40
        noise = np.convolve(noise, np.ones(k) / k, mode="same")
        env = np.sin(np.linspace(0, np.pi, m)) ** 2
        out[s:s + m] += gain * 6 * noise * env

    # Kanca: patlama + whoosh
    m = int(0.9 * sr)
    tt = np.arange(m) / sr
    out[:m] += 0.6 * np.sin(2 * np.pi * (40 + 90 * np.exp(-tt * 12)) * tt) * np.exp(-tt * 4)
    whoosh(0.0, 0.5, 0.3)
    for st in scene_starts[1:]:
        whoosh(max(0, st - 0.3), 0.6, 0.22)
    fade = int(1.0 * sr)
    out[-fade:] *= np.linspace(1, 0, fade)
    out = np.clip(out, -1, 1)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes((out * 32767 * 0.8).astype(np.int16).tobytes())


# ---------------------------------------------------------------- statik katmanlar
def load_static(image_path):
    src = Image.open(image_path).convert("RGB")
    # Arka plan: bulanık + karartılmış görsel
    s = max(W / src.width, H / src.height)
    bg = src.resize((int(src.width * s) + 1, int(src.height * s) + 1), Image.LANCZOS)
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
    bg = bg.filter(ImageFilter.GaussianBlur(45))
    dark = Image.new("RGB", (W, H), NAVY)
    bg = Image.blend(bg, dark, 0.62)
    # Kart altı geçiş gradyanı
    grad = Image.new("L", (1, CARD_H))
    for y in range(CARD_H):
        grad.putpixel((0, y), int(255 * clamp((y - CARD_H * 0.62) / (CARD_H * 0.38)) ** 1.5))
    grad = grad.resize((W, CARD_H))
    return src, bg, grad


def card_frame(src, t, hook_end):
    # Kanca bölümünde hızlı yakınlaşma, sonra yavaş Ken Burns
    if t < hook_end:
        z = 1.32 - 0.18 * ease_out(t / hook_end)
        fx, fy = 0.62, 0.36
    else:
        p = (t - hook_end) / (DUR - hook_end)
        z = 1.14 + 0.16 * p
        fx, fy = 0.58 - 0.1 * p, 0.38
    aspect = W / CARD_H
    bw = src.width / z
    bh = bw / aspect
    if bh > src.height / z * 1.0:
        bh = src.height / z
        bw = bh * aspect
    cx, cy = fx * src.width, fy * src.height
    x0 = clamp(cx - bw / 2, 0, src.width - bw)
    y0 = clamp(cy - bh / 2, 0, src.height - bh)
    return src.resize((W, CARD_H), Image.BILINEAR, box=(x0, y0, x0 + bw, y0 + bh))


# ---------------------------------------------------------------- çizim parçaları
def chip(d, x, y, text, bg=RED, fg=WHITE, size=34):
    f = font("Black", size)
    tw = text_w(f, text)
    d.rounded_rectangle((x, y, x + tw + 36, y + size + 22), radius=10, fill=bg)
    d.text((x + 18, y + 8), text, font=f, fill=fg)
    return tw + 36


def draw_topbar(img, t):
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, W, TOP_H), fill=(10, 12, 20))
    # İlerleme çubuğu (izleyiciyi tutar)
    d.rectangle((0, 0, int(W * t / DUR), 8), fill=YEL)
    pulse = 0.5 + 0.5 * math.sin(t * 8)
    d.rounded_rectangle((36, 34, 330, 98), radius=12, fill=RED)
    r = 9 + 3 * pulse
    d.ellipse((62 - r, 66 - r, 62 + r, 66 + r), fill=WHITE)
    d.text((86, 44), "SON DAKİKA", font=font("Black", 36), fill=WHITE)
    d.text((356, 46), "MAGAZİN  |  04.11.2026", font=font("ExtraBold", 32), fill=(200, 205, 220))


def draw_ticker(img, t):
    d = ImageDraw.Draw(img)
    d.rectangle((0, TICKER_Y, W, TICKER_Y + TICKER_H), fill=(8, 10, 16))
    f = font("ExtraBold", 34)
    tw = text_w(f, TICKER)
    off = (t * 170) % tw
    x = 230 - off
    while x < W:
        d.text((x, TICKER_Y + 20), TICKER, font=f, fill=WHITE)
        x += tw
    d.rectangle((0, TICKER_Y, 210, TICKER_Y + TICKER_H), fill=RED)
    d.text((26, TICKER_Y + 18), "GÜNDEM", font=font("Black", 38), fill=WHITE)
    d.rectangle((0, TICKER_Y - 6, W, TICKER_Y), fill=YEL)


def draw_cam_frame(img, level, has_webcam, t):
    d = ImageDraw.Draw(img)
    cx, cy, r = CAM_X + CAM_D / 2, CAM_Y + CAM_D / 2, CAM_D / 2
    # Sesle nabız atan dış halka
    g = 8 + 14 * level
    d.ellipse((cx - r - g, cy - r - g, cx + r + g, cy + r + g), fill=(*RED,))
    d.ellipse((cx - r - 9, cy - r - 9, cx + r + 9, cy + r + 9), fill=WHITE)
    if not has_webcam:
        # Yer tutucu: kayıt eklenince ffmpeg bu dairenin üstüne kamerayı bindirir
        ph = Image.new("RGB", (CAM_D, CAM_D), (38, 46, 66))
        pd = ImageDraw.Draw(ph)
        c = CAM_D / 2
        pd.ellipse((c - 62, c - 120, c + 62, c + 4), fill=(120, 132, 158))
        pd.ellipse((c - 140, c + 30, c + 140, c + 300), fill=(120, 132, 158))
        f = font("Black", 26)
        lbl = "KAMERAN BURAYA"
        pd.text((c - text_w(f, lbl) / 2, c + 84), lbl, font=f, fill=WHITE)
        mask = Image.new("L", (CAM_D, CAM_D), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, CAM_D - 1, CAM_D - 1), fill=255)
        img.paste(ph, (CAM_X, CAM_Y), mask)
    # İsim etiketi
    f = font("Black", 26)
    lbl = "ANLATICI"
    tw = text_w(f, lbl)
    d.rounded_rectangle((cx - tw / 2 - 20, CAM_Y + CAM_D + 4, cx + tw / 2 + 40, CAM_Y + CAM_D + 44),
                        radius=10, fill=RED)
    blink = 1 if int(t * 2) % 2 == 0 else 0
    if blink:
        d.ellipse((cx + tw / 2 + 12, CAM_Y + CAM_D + 16, cx + tw / 2 + 28, CAM_Y + CAM_D + 32), fill=WHITE)
    d.text((cx - tw / 2, CAM_Y + CAM_D + 9), lbl, font=f, fill=WHITE)


def draw_subtitle(img, words, t):
    # 3 kelimelik parçalar, aktif kelime sarı
    chunks, cur = [], []
    for w in words:
        if cur and (len(cur) == 3 or cur[-1]["si"] != w["si"]
                    or sum(len(x["w"]) for x in cur) + len(w["w"]) > 20):
            chunks.append(cur)
            cur = []
        cur.append(w)
    if cur:
        chunks.append(cur)
    active = None
    for i, c in enumerate(chunks):
        end = chunks[i + 1][0]["s"] if i + 1 < len(chunks) else c[-1]["e"] + 0.6
        end = min(end, c[-1]["e"] + 0.6)
        if c[0]["s"] - 0.05 <= t < end:
            active = c
    if not active:
        return
    pop = ease_back((t - active[0]["s"] + 0.05) / 0.16)
    size = int(70 * (0.82 + 0.18 * pop))
    f = font("Black", size)
    parts = [tr_upper(w["w"]) for w in active]
    space = text_w(f, " ")
    total = sum(text_w(f, p) for p in parts) + space * (len(parts) - 1)
    if total > W - 80:
        size = int(size * (W - 80) / total)
        f = font("Black", size)
        space = text_w(f, " ")
        total = sum(text_w(f, p) for p in parts) + space * (len(parts) - 1)
    d = ImageDraw.Draw(img)
    x = (W - total) / 2
    for w, p in zip(active, parts):
        on = w["s"] - 0.03 <= t < w["e"] + 0.05
        fill = YEL if on else WHITE
        d.text((x, SUB_Y), p, font=f, fill=fill, stroke_width=9, stroke_fill=BLACK)
        x += text_w(f, p) + space


# ---------------------------------------------------------------- sahne panelleri
PANEL_H = 345


def panel_layer():
    return Image.new("RGBA", (W, PANEL_H), (0, 0, 0, 0))


def scene_hook(t, dur):
    L = panel_layer()
    d = ImageDraw.Draw(L)
    a = ease_back(t / 0.35)
    f1 = font("Black", 66)
    s1 = "YAPAY ZEKAYA SORULAN"
    d.text(((W - text_w(f1, s1)) / 2, 6), s1, font=f1, fill=WHITE, stroke_width=6, stroke_fill=BLACK)
    f2 = font("Black", int(120 * (0.6 + 0.4 * a)))
    s2 = "2 SORU"
    w2 = text_w(f2, s2)
    bx = (W - w2) / 2
    d.rounded_rectangle((bx - 30, 92, bx + w2 + 30, 92 + 150), radius=18, fill=RED)
    d.text((bx, 92 + (150 - f2.size) / 2 - 12), s2, font=f2, fill=YEL)
    if t > 0.6:
        k = ease_out((t - 0.6) / 0.3)
        f3 = font("Black", 54)
        s3 = "SORUŞTURMAYI DEĞİŞTİRİR Mİ?"
        d.text(((W - text_w(f3, s3)) / 2, 262 + 20 * (1 - k)), s3, font=f3,
               fill=(255, 255, 255, int(255 * k)), stroke_width=6, stroke_fill=(0, 0, 0, int(255 * k)))
    return L


def scene_complaint(t, dur):
    L = panel_layer()
    d = ImageDraw.Draw(L)
    chip(d, 40, 0, "SUÇ DUYURUSU")
    f = font("Black", 62)
    y = 80
    for line in wrap("Güllü'nün oğlu hakkında suç duyurusu", f, W - 80):
        d.text((40, y), line, font=f, fill=WHITE, stroke_width=5, stroke_fill=BLACK)
        y += 74
    k = ease_out((t - 0.8) / 0.4)
    if k > 0:
        f2 = font("ExtraBold", 42)
        d.rectangle((40, y + 18, 50, y + 18 + 104), fill=(*YEL, int(255 * k)))
        d.text((70 - 30 * (1 - k), y + 14), "Başvuran: Güllü'nün ablasının avukatları", font=f2,
               fill=(220, 225, 240, int(255 * k)))
        d.text((70 - 30 * (1 - k), y + 68), "İddia: Delilleri yok etme / karartma", font=f2,
               fill=(*YEL, int(255 * k)))
    return L


def scene_flash(t, dur):
    L = panel_layer()
    d = ImageDraw.Draw(L)
    chip(d, 40, 0, "İDDİA")
    chip(d, 170, 0, "DELİL TESLİM SÜRECİ", bg=(40, 50, 75))
    boxes = [("KAMERA", "KAYITLARI"), ("FLASH", "BELLEĞE"), ("HAFTALAR SONRA", "TESLİM")]
    bw, bh, gap = 300, 170, 45
    x0 = (W - (3 * bw + 2 * gap)) / 2
    y0 = 92
    for i, (a, b) in enumerate(boxes):
        k = ease_back((t - 0.25 - i * 0.9) / 0.35)
        if k <= 0:
            continue
        x = x0 + i * (bw + gap)
        last = i == 2
        fill = RED if last else (245, 245, 250)
        fg = WHITE if last else NAVY
        cy = y0 + bh / 2
        hw, hh = bw / 2 * k, bh / 2 * k
        d.rounded_rectangle((x + bw / 2 - hw, cy - hh, x + bw / 2 + hw, cy + hh), radius=18, fill=fill)
        if k > 0.7:
            fa = font("Black", 36 if len(a) < 10 else 30)
            fb = font("ExtraBold", 32)
            d.text((x + (bw - text_w(fa, a)) / 2, cy - 46), a, font=fa, fill=fg)
            d.text((x + (bw - text_w(fb, b)) / 2, cy + 6), b, font=fb, fill=fg)
        if i > 0:
            ax = x - gap + 6
            d.polygon([(ax, cy - 18), (ax + gap - 14, cy), (ax, cy + 18)], fill=YEL)
    k = ease_out((t - 3.0) / 0.4)
    if k > 0:
        f = font("SemiBold", 34)
        s = "Avukatlar, dijital delillerin incelenmesini istedi."
        d.text(((W - text_w(f, s)) / 2, y0 + bh + 26), s, font=f, fill=(225, 230, 240, int(255 * k)))
    return L


def scene_ai(t, dur):
    L = panel_layer()
    d = ImageDraw.Draw(L)
    chip(d, 40, 0, "YAPAY ZEKAYA SORDUĞU İDDİA EDİLEN SORULAR", bg=(40, 50, 75), size=30)
    qs = ["Bir videonun sesiyle oynandığı tespit edilebilir mi?",
          "Geçmiş kamera kayıtlarına ulaşılabilir mi?"]
    f = font("ExtraBold", 40)
    y = 82
    for i, q in enumerate(qs):
        start = 0.2 + i * (dur * 0.55)
        if t < start:
            break
        typed = 1.0 if i else clamp((t - start) / (dur * 0.45))
        if i:
            typed = clamp((t - start) / 0.9)
        n = int(len(q) * typed)
        shown = q[:n] + ("|" if typed < 1 and int(t * 6) % 2 == 0 else "")
        lines = wrap(q, f, 820)
        bh = len(lines) * 50 + 34
        bx = W - 60 - 880
        d.rounded_rectangle((bx, y, W - 60, y + bh), radius=26, fill=(245, 246, 250))
        d.polygon([(W - 60, y + bh - 30), (W - 30, y + bh + 6), (W - 90, y + bh)], fill=(245, 246, 250))
        # Yazılan metni satırlara dağıt
        rem = shown
        ly = y + 16
        for line in lines:
            part = rem[:len(line)]
            rem = rem[len(line):].lstrip(" ")
            d.text((bx + 30, ly), part, font=f, fill=NAVY)
            ly += 50
        y += bh + 28
    return L


def scene_outro(t, dur):
    L = panel_layer()
    d = ImageDraw.Draw(L)
    a = ease_back(t / 0.35)
    f = font("Black", int(104 * (0.7 + 0.3 * a)))
    s1, s2 = "İDDİA", "KANIT"
    gap = text_w(f, " ")
    parts = [(s1, WHITE), ("≠", RED), (s2, YEL)]
    total = sum(text_w(f, s) for s, _ in parts) + 2 * gap
    x = (W - total) / 2
    for s, c in parts:
        d.text((x, 0), s, font=f, fill=c, stroke_width=6, stroke_fill=BLACK)
        x += text_w(f, s) + gap
    k = ease_out((t - 0.5) / 0.4)
    f2 = font("SemiBold", 36)
    s = "Suç duyurusu, suçun kanıtlandığı anlamına gelmez."
    d.text(((W - text_w(f2, s)) / 2, 150), s, font=f2, fill=(230, 233, 242, int(255 * k)))
    k2 = ease_back((t - 1.6) / 0.4)
    if k2 > 0:
        f3 = font("Black", 44)
        s3 = "SORUŞTURMA SÜRÜYOR • TAKİPTE KAL"
        tw = text_w(f3, s3)
        bx = (W - tw) / 2
        d.rounded_rectangle((bx - 26, 222, bx + tw + 26, 300), radius=16, fill=(*RED, int(255 * min(1, k2))))
        d.text((bx, 236), s3, font=f3, fill=WHITE)
    return L


SCENES = [scene_hook, scene_complaint, scene_flash, scene_ai, scene_outro]


def name_lower_third(img, t):
    k = ease_out(t / 0.45)
    d = ImageDraw.Draw(img)
    y = CARD_Y + CARD_H - 190
    x = -600 * (1 - k) + 40
    f1, f2 = font("Black", 40), font("ExtraBold", 30)
    n = "TUĞBERK YAĞIZ GÜLTER"
    w1 = text_w(f1, n) + 44
    d.rectangle((x, y, x + w1, y + 64), fill=WHITE)
    d.text((x + 22, y + 9), n, font=f1, fill=NAVY)
    d.rectangle((x, y + 64, x + 300, y + 112), fill=RED)
    d.text((x + 22, y + 72), "Güllü'nün oğlu", font=f2, fill=WHITE)


# ---------------------------------------------------------------- ana döngü
def render(args):
    sentences = [l.strip() for l in open(args.script, encoding="utf-8") if l.strip()]
    assert len(sentences) == len(SCENES), f"script.txt {len(SCENES)} satır olmalı (her satır bir sahne)"
    n_frames = int(DUR * FPS)
    words = word_timings(sentences, args.audio, args.words)
    starts = [0.0] + [min(w["s"] for w in words if w["si"] == i) - 0.15 for i in range(1, len(SCENES))]
    print("Sahne başlangıçları:", ", ".join(f"{s:.2f}s" for s in starts))
    levels = audio_levels(args.audio, n_frames)
    src, bg, grad = load_static(args.image)

    tmp = tempfile.mkdtemp(prefix="haber_")
    music = os.path.join(tmp, "music.wav")
    make_music(music, starts)

    cmd = ["ffmpeg", "-y", "-v", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-ss", str(args.audio_start), "-i", args.audio, "-i", music]
    fc = []
    vlabel = "0:v"
    if args.webcam:
        cmd += ["-ss", str(args.webcam_start), "-i", args.webcam]
        D = CAM_D
        fc.append(f"[3:v]fps={FPS},crop=w='min(iw,ih)':h='min(iw,ih)':x='(iw-min(iw,ih))/2':y='(ih-min(iw,ih))/3',"
                  f"scale={D}:{D},{'hflip,' if args.mirror else ''}format=rgba,"
                  f"geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lte(hypot(X-{D/2},Y-{D/2}),{D/2 - 1}),255,0)'[cam]")
        fc.append(f"[0:v][cam]overlay={CAM_X}:{CAM_Y}:shortest=0[v]")
        vlabel = "[v]"
    fc.append(f"[1:a]atrim=0:{DUR},asetpts=PTS-STARTPTS,volume={args.voice_gain}[nar]")
    fc.append(f"[2:a]volume={args.music_gain}[mus]")
    fc.append(f"[nar][mus]amix=inputs=2:duration=longest:normalize=0,apad,atrim=0:{DUR},"
              f"afade=t=out:st={DUR - 0.6}:d=0.6[a]")
    cmd += ["-filter_complex", ";".join(fc), "-map", vlabel, "-map", "[a]",
            "-t", str(DUR), "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", args.out]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    preview_frames = {int(float(x) * FPS) for x in args.preview.split(",")} if args.preview else set()
    for fi in range(n_frames):
        t = fi / FPS
        si = max(i for i, s in enumerate(starts) if s <= t)
        st = starts[si]
        nxt = starts[si + 1] if si + 1 < len(starts) else DUR
        lt = t - st

        img = bg.copy()
        card = card_frame(src, t, starts[1])
        img.paste(card, (0, CARD_Y))
        img.paste(Image.new("RGB", (W, CARD_H), NAVY), (0, CARD_Y), grad)
        d = ImageDraw.Draw(img)
        fs = font("SemiBold", 24)
        d.text((W - 30 - text_w(fs, SOURCE), CARD_Y + 18), SOURCE, font=fs, fill=WHITE,
               stroke_width=3, stroke_fill=BLACK)
        if si == 1:
            name_lower_third(img, lt)
        if si == 0:
            # Kancada kırmızı çerçeve vurgusu
            pk = 0.5 + 0.5 * math.sin(t * 10)
            d.rectangle((0, CARD_Y, W - 1, CARD_Y + CARD_H), outline=(*RED,), width=int(6 + 6 * pk))

        # Sahne paneli: aşağıdan kayarak girer, sonunda söner
        layer = SCENES[si](lt, nxt - st)
        kin = ease_out(lt / 0.35)
        kout = 1 - clamp((t - (nxt - 0.2)) / 0.2) if si + 1 < len(starts) else 1
        dy = int(60 * (1 - kin))
        dx = 0
        if si == 0 and lt < 0.5:
            dx = int(10 * math.sin(lt * 90) * (1 - lt / 0.5))
        layer = with_alpha(layer, kin * kout)
        img.paste(layer, (dx, PANEL_Y + dy), layer)

        draw_topbar(img, t)
        draw_subtitle(img, words, t)
        draw_cam_frame(img, levels[fi], bool(args.webcam), t)
        draw_ticker(img, t)

        # Kanca başında beyaz flaş
        if t < 0.25:
            img = Image.blend(img, Image.new("RGB", (W, H), WHITE), 0.85 * (1 - t / 0.25))
        if fi in preview_frames:
            img.save(os.path.join(os.path.dirname(args.out) or ".", f"onizleme_{t:05.2f}s.png"))
        proc.stdin.write(img.tobytes())
    proc.stdin.close()
    if proc.wait() != 0:
        sys.exit("ffmpeg hata verdi")
    print("Hazır:", args.out)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--webcam", help="Senin kamera kaydın (metni okurken). Sesi de buradan alınır.")
    p.add_argument("--audio", help="Ayrı ses dosyası (varsayılan: --webcam varsa onun sesi, yoksa demo TTS)")
    p.add_argument("--words", help="Kelime zamanlama JSON'u (yalnızca demo TTS için)")
    p.add_argument("--webcam-start", type=float, default=0.0, help="Kayıtta konuşmanın başladığı saniye")
    p.add_argument("--audio-start", type=float, default=None, help="Seste başlangıç saniyesi")
    p.add_argument("--mirror", action="store_true", help="Kamerayı aynala")
    p.add_argument("--image", default=os.path.join(ASSETS, "haber_gorseli.jpg"))
    p.add_argument("--script", default=os.path.join(HERE, "script.txt"))
    p.add_argument("--voice-gain", type=float, default=1.0)
    p.add_argument("--music-gain", type=float, default=0.22)
    p.add_argument("--out", default=os.path.join(HERE, "cikti", "haber_video.mp4"))
    p.add_argument("--preview", help="Bu saniyelerde PNG kaydet, örn. 1,6,14")
    a = p.parse_args()
    if a.audio is None:
        if a.webcam:
            a.audio = a.webcam
            if a.audio_start is None:
                a.audio_start = a.webcam_start
        else:
            a.audio = os.path.join(ASSETS, "demo_ses.mp3")
            a.words = a.words or os.path.join(ASSETS, "demo_kelimeler.json")
    if a.audio_start is None:
        a.audio_start = 0.0
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    if a.audio_start:
        # Seviyeler ve zamanlama da aynı kesimden ölçülsün
        cut = os.path.join(tempfile.mkdtemp(prefix="haber_"), "ses.wav")
        run(["ffmpeg", "-y", "-v", "error", "-ss", str(a.audio_start), "-i", a.audio, "-vn", cut])
        a.audio, a.audio_start = cut, 0.0
    render(a)


if __name__ == "__main__":
    main()
