"""Veresiye defteri videosu için: seslendirme boşluklarını kırpar, transkripti yeni zamana eşler,
telifsiz (sentezlenmiş) sıcak/nostaljik bir fon müziği üretir.

Çıktılar: voice_trim.wav, music.wav, timeline.json
"""
import json, re, subprocess, wave
import numpy as np

SR = 44100
HERE = __file__.rsplit('/', 1)[0]
KEEP = 0.11      # uzun boşlukların her iki ucunda bırakılan sessizlik (toplam ~0.22 sn)
MIN_GAP = 0.26   # bundan kısa boşluklara dokunulmaz
TAIL = 1.6       # ses bittikten sonra son kare

def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

def save(path, x, ch=1):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(ch); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

v = load(f'{HERE}/voice_raw.mp3')
det = subprocess.run(['ffmpeg', '-hide_banner', '-i', f'{HERE}/voice_raw.mp3', '-af', 'silencedetect=noise=-35dB:d=0.18', '-f', 'null', '-'],
                     capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', det)]
en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', det)]
cuts = [(a + KEEP, b - KEEP) for a, b in zip(st, en) if b - a > MIN_GAP]
# sondaki sessizliği tamamen at
if cuts and en[-1] >= len(v) / SR - 0.05:
    cuts[-1] = (st[-1] + 0.15, len(v) / SR)

keep, prev = [], 0.0
for a, b in cuts:
    keep.append((prev, a)); prev = b
keep.append((prev, len(v) / SR))
keep = [(a, b) for a, b in keep if b - a > 0.01]

fade = int(0.006 * SR)
parts, mp, cur = [], [], 0.0
for a, b in keep:
    c = v[int(a * SR):int(b * SR)].copy()
    c[:fade] *= np.linspace(0, 1, fade); c[-fade:] *= np.linspace(1, 0, fade)
    mp.append((a, b, cur)); parts.append(c); cur += len(c) / SR
voice = np.concatenate(parts)

def raw2new(t):
    for a, b, c in mp:
        if t < a: return c
        if t <= b: return c + t - a
    return cur

total = len(voice) / SR + TAIL
# Cümle başlangıçları (ham ses, sessizlik analiziyle metne eşlendi)
SENT = [(0.00, "Eskiden kredi kartı yoktu…"), (1.98, "ama herkesin bir limiti vardı."), (3.83, "Hem de bankada değil,"),
  (5.18, "köşedeki bakkalın tezgâhının altındaki o çizgili defterde."), (8.61, "\"Babam yazdırır\" demen yeterdi."),
  (10.40, "Ne şifre sorulurdu ne kimlik."), (12.20, "Ekmek,"), (12.76, "süt,"), (13.36, "bir de gizlice aldığın sakız…"),
  (15.13, "hepsi kurşun kalemle yazılırdı."), (17.06, "Ay sonu baban gelir,"), (18.39, "borç kapanır,"), (19.29, "sayfanın üstü çizilirdi."),
  (21.19, "Faiz yoktu,"), (22.25, "gecikme cezası yoktu."), (23.93, "Bir tek güven vardı."), (25.57, "O defter bir hesap defteri değildi aslında."),
  (28.53, "Bütün mahallenin birbirine güvendiğini gösteren bir defterdi."), (31.87, "Senin bakkalın kimdi?"), (33.39, "Adını yorumlara yaz, hatırlayalım.")]
tl = [{'start': round(raw2new(t), 2), 'text': s} for t, s in SENT]
save(f'{HERE}/voice_trim.wav', voice)
json.dump({'duration': round(total, 2), 'segments': tl}, open(f'{HERE}/timeline.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'ham {len(v)/SR:.2f} sn -> kırpılmış {len(voice)/SR:.2f} sn, video {total:.2f} sn')
for s in tl: print(f"{s['start']:6.2f}  {s['text']}")

# --- Fon müziği: 100 BPM, akustik gitar (Karplus-Strong) + bas + hafif shaker, mahalle havası (G - Em - C - D) ---
BPM = 100; beat = 60 / BPM
n = int((total + 1) * SR)
L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
rng = np.random.default_rng(5)
def f(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= n: return
    sig = sig[:n - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2)
    R[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2)
_cache = {}
def pluck(m, d=1.4, bright=.5):
    key = (m, d, bright)
    if key in _cache: return _cache[key]
    N = int(SR / f(m)); buf = rng.uniform(-1, 1, N).astype(np.float32)
    out = np.zeros(int(d * SR), np.float32); idx = 0; prev = 0.0
    for i in range(len(out)):
        x = buf[idx]; y = .996 * (bright * x + (1 - bright) * .5 * (x + prev)); prev = x
        buf[idx] = .5 * (x + buf[(idx + 1) % N]) * .998 + 0 * y; out[i] = x; idx = (idx + 1) % N
    out *= np.minimum(1, np.arange(len(out)) / 40)
    _cache[key] = out / (np.abs(out).max() + 1e-9); return _cache[key]
def env_t(d): return np.arange(int(d * SR)) / SR
def bass(m, d):
    t = env_t(d); fr = f(m)
    return (np.sin(2*np.pi*fr*t) + .3*np.sin(2*np.pi*fr*2*t)) * np.minimum(1, t*60) * np.exp(-t*2.5)
def shaker(d=.07):
    t = env_t(d); x = rng.standard_normal(len(t)).astype(np.float32); x = np.diff(x, prepend=0)
    return x * np.sin(np.pi * t / d)
def bell(m, d=1.5):
    t = env_t(d); fr = f(m)
    return (np.sin(2*np.pi*fr*t) + .3*np.sin(2*np.pi*fr*2.76*t)*np.exp(-t*6)) * np.exp(-t*3) * np.minimum(1, t*300)

CH = [(43, [55, 59, 62, 67, 71]), (40, [52, 55, 59, 64, 67]), (36, [48, 55, 60, 64, 67]), (38, [50, 57, 62, 66, 69])]
PAT = [0, 2, 1, 3, 2, 4, 3, 2]
MEL = [[79, None, 78, 76, None, 74, None, None], [76, None, None, 74, 71, None, None, None],
       [72, None, 74, 76, None, 79, None, 76], [74, None, None, None, 78, None, None, None]]
bar = 4 * beat; t0 = 0.0; k = 0
while t0 < total + 1:
    root, tones = CH[k % 4]
    for j in range(8):
        add(pluck(tones[PAT[j]], 1.2, .55), t0 + j * beat / 2 + (0.012 * (j % 2)), -.25 if j % 2 else .25, .22)
    add(bass(root, beat * 2), t0, 0, .4); add(bass(root + 7, beat * 1.5), t0 + 2 * beat, 0, .3)
    if k >= 1:
        for j in range(8): add(shaker(), t0 + j * beat / 2, .3, .05 if j % 2 else .03)
    if k >= 2:
        for j, m in enumerate(MEL[k % 4]):
            if m: add(bell(m, 1.6), t0 + j * beat / 2, 0, .16)
    t0 += bar; k += 1

sm = np.stack([L, R], 1)[:int(total * SR)]
sm /= np.abs(sm).max() + 1e-9
fi, fo = int(.5 * SR), int(2.0 * SR)
sm[:fi] *= np.linspace(0, 1, fi)[:, None]; sm[-fo:] *= np.linspace(1, 0, fo)[:, None]
save(f'{HERE}/music.wav', (sm * .9).reshape(-1), ch=2)
print('müzik hazır')
