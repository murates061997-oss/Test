"""Seslendirmedeki boşlukları kırpar, animasyon için zaman eşlemesi üretir
ve telifsiz (sentezlenmiş) bir fon müziği oluşturur.

Çıktılar: voice_trim.wav, music.wav, timemap.json
"""
import json, subprocess, wave
import numpy as np

SR = 44100
HERE = __file__.rsplit('/', 1)[0]

def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

def save(path, x, ch=1):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(ch); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

# --- 1) Konuşma parçaları (silencedetect -35dB ile bulundu, cümlelerle eşleştirildi) ---
# (başlangıç, bitiş, sonraki boşluk türü)  'c' = cümle içi kısa, 's' = cümle arası
SEG = [
    (0.00, 1.91, 's'),   # Eskiden Türkiye'de herkes milyonerdi.
    (2.48, 2.81, 'c'),   # Evet,
    (3.10, 4.28, 'c'),   # sen de, ben de,
    (4.53, 5.26, 's'),   # bakkal amca da!
    (6.50, 9.19, 's'),   # Bir simit ... çıkarırdın.
    (9.92, 11.80, 's'),  # Bir ekmeğin parası ...
    (12.28, 14.44, 's'), # Asgari ücret ...
    (15.09, 17.62, 's'), # Cüzdanlarda ...
    (18.48, 20.36, 's'), # Hesap makineleri ...
    (21.24, 24.89, 's'), # Sonra 1 Ocak 2005 geldi ve bir gecede ... silindi.
    (25.61, 27.44, 's'), # 1 milyon lira 1 YTL oldu.
    (28.15, 30.79, 's'), # Milyonerler sabah ...
    (31.43, 33.28, 'c'), # Bir süre herkes "Bu kaç milyon ediyordu?"
    (33.62, 34.82, 's'), # diye kafasında hesap yaptı.
    (35.59, 37.03, 's'), # Hatta bazıları hâlâ yapıyor.
    (37.59, 38.95, 's'), # Sen o günleri hatırlıyor musun?
    (39.34, 40.02, 'c'), # Yorumlara yaz:
    (40.32, 41.64, 'e'), # Bir simit sana kaça mal oluyordu?
]
PRE, POST = 0.05, 0.08
GAP = {'c': 0.10, 's': 0.22, 'e': 0.0}   # parçalar arasına eklenen ek sessizlik

# Animasyon çapaları: (ham ses zamanı, animasyondaki orijinal zaman)
ANCH = [(0.0, 0.0), (3.10, 2.5), (3.82, 3.1), (4.53, 3.8), (6.50, 5.0), (9.92, 8.3), (12.28, 10.6),
        (15.09, 13.4), (18.48, 16.2), (21.24, 19.0), (23.20, 21.6), (25.61, 25.0), (28.15, 27.8),
        (31.43, 31.4), (35.59, 34.4), (37.59, 37.0), (39.34, 39.0)]
TAIL = 2.4   # ses bittikten sonra kapanış animasyonu

v = load(f'{HERE}/voice_raw.mp3')
out, mapping, cur = [], [], 0.0
fade = int(0.008 * SR)
for s, e, g in SEG:
    a, b = max(0.0, s - (PRE if s > 0 else 0)), e + POST
    chunk = v[int(a * SR):int(b * SR)].copy()
    chunk[:fade] *= np.linspace(0, 1, fade); chunk[-fade:] *= np.linspace(1, 0, fade)
    mapping.append((a, b, cur))
    out.append(chunk); cur += len(chunk) / SR
    z = int(GAP[g] * SR); out.append(np.zeros(z, np.float32)); cur += z / SR
voice = np.concatenate(out)

def raw2new(t):
    for a, b, c in mapping:
        if t <= b: return c + max(0.0, t - a)
    return mapping[-1][2] + (mapping[-1][1] - mapping[-1][0])

voice_len = len(voice) / SR
total = voice_len + TAIL
anchors = [[round(raw2new(r), 3), o] for r, o in ANCH] + [[round(total, 3), 45.0]]
save(f'{HERE}/voice_trim.wav', voice)
json.dump({'duration': round(total, 3), 'anchors': anchors}, open(f'{HERE}/timemap.json', 'w'), indent=1)
print(f'ham ses 42.11 sn -> kırpılmış {voice_len:.2f} sn, video {total:.2f} sn')

# --- 2) Fon müziği: neşeli, nostaljik marimba + bas + hafif ritim (C - Am - F - G) ---
BPM = 108; beat = 60 / BPM
n = int((total + 1) * SR)
L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
rng = np.random.default_rng(7)
def f(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= n: return
    sig = sig[:n - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2)
    R[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2)
def env_t(d): return np.arange(int(d * SR)) / SR
def marimba(m, d=.6):
    t = env_t(d); fr = f(m)
    return (np.sin(2*np.pi*fr*t) + .35*np.sin(2*np.pi*fr*4*t)*np.exp(-t*30) + .15*np.sin(2*np.pi*fr*10*t)*np.exp(-t*60)) * np.exp(-t*7)
def bass(m, d):
    t = env_t(d); fr = f(m)
    x = np.sin(2*np.pi*fr*t) + .3*np.sin(2*np.pi*fr*2*t) + .12*np.sin(2*np.pi*fr*3*t)
    return x * np.minimum(1, t*80) * np.exp(-t*3.2)
def kick():
    t = env_t(.3); ph = 2*np.pi*np.cumsum(50 + 90*np.exp(-t*35)) / SR
    return np.sin(ph) * np.exp(-t*14)
def hat(d=.05):
    t = env_t(d); x = rng.standard_normal(len(t)).astype(np.float32); x = np.diff(x, prepend=0)
    return x * np.exp(-t*90)
def clap():
    t = env_t(.18); x = rng.standard_normal(len(t)).astype(np.float32)
    return x * (np.exp(-t*25) + .6*np.exp(-((t-.012)%.012)*400)*(t<.04))
def pad(ms, d):
    t = env_t(d); x = sum(np.sin(2*np.pi*f(m)*t + .3*np.sin(2*np.pi*5*t)) for m in ms) / len(ms)
    return x * np.minimum(1, t*3) * np.minimum(1, (d - t)*3)

CH = [(48, [60, 64, 67, 72]), (45, [57, 60, 64, 69]), (41, [53, 57, 60, 65]), (43, [55, 59, 62, 67])]
ARP = [0, 1, 2, 3, 2, 1, 2, 3]
MEL = [76, None, 79, 76, 74, None, 72, None,  72, None, 76, 72, 69, None, None, None,
       69, None, 72, 77, 76, None, 72, None,  71, None, 74, 79, 74, None, None, None]
bar = 4 * beat; t0 = 0.0; k = 0
while t0 < total + 1:
    root, tones = CH[k % 4]
    add(pad([m - 12 for m in tones[:3]], bar), t0, 0, .10)
    for j in range(8):
        tt = t0 + j * beat / 2
        add(marimba(tones[ARP[j]] + 12), tt, .35 if j % 2 else -.35, .16)
        add(hat(), tt + (0.012 if j % 2 else 0), .2, .05 if j % 2 else .035)
    for j, bt in enumerate([0, 1.5, 2, 3.5]):
        add(bass(root + (12 if j == 3 else 0), beat * 1.2), t0 + bt * beat, 0, .32)
    add(kick(), t0, 0, .5); add(kick(), t0 + 2 * beat, 0, .45)
    add(clap(), t0 + beat, -.1, .12); add(clap(), t0 + 3 * beat, .1, .12)
    if k >= 2:
        for j in range(8):
            m = MEL[(k % 4) * 8 + j]
            if m: add(marimba(m + 12, .9), t0 + j * beat / 2, 0, .2)
    t0 += bar; k += 1

st = np.stack([L, R], 1)[:int(total * SR)]
st /= np.abs(st).max() + 1e-9
fi, fo = int(.4 * SR), int(1.8 * SR)
st[:fi] *= np.linspace(0, 1, fi)[:, None]; st[-fo:] *= np.linspace(1, 0, fo)[:, None]
save(f'{HERE}/music.wav', (st * .9).reshape(-1), ch=2)
print('müzik:', f'{len(st)/SR:.2f} sn')
