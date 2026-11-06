"""Soba videosu için: seslendirme boşluklarını kırpar, transkripti yeni zamana eşler,
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
tr = json.load(open(f'{HERE}/transcript.json', encoding='utf-8'))
tl = [{'start': round(raw2new(s['start']), 2), 'end': round(raw2new(s['end']), 2), 'text': s['text'].strip(),
       'words': [[round(raw2new(w[0]), 2), w[2].strip()] for w in s['words']]} for s in tr]
save(f'{HERE}/voice_trim.wav', voice)
json.dump({'duration': round(total, 2), 'segments': tl}, open(f'{HERE}/timeline.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'ham {len(v)/SR:.2f} sn -> kırpılmış {len(voice)/SR:.2f} sn, video {total:.2f} sn')
for s in tl: print(f"{s['start']:6.2f}-{s['end']:6.2f}  {s['text']}")

# --- Fon müziği: 92 BPM, sıcak müzik kutusu + yumuşak pad + bas + fırça ritim (F - Dm - Bb - C) ---
BPM = 92; beat = 60 / BPM
n = int((total + 1) * SR)
L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
rng = np.random.default_rng(11)
def f(m): return 440 * 2 ** ((m - 69) / 12)
def env_t(d): return np.arange(int(d * SR)) / SR
def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= n: return
    sig = sig[:n - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2)
    R[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2)
def musicbox(m, d=1.2):
    t = env_t(d); fr = f(m)
    return (np.sin(2*np.pi*fr*t) + .45*np.sin(2*np.pi*fr*3.01*t)*np.exp(-t*9) + .2*np.sin(2*np.pi*fr*5.4*t)*np.exp(-t*20)) * np.exp(-t*3.5) * np.minimum(1, t*400)
def bass(m, d):
    t = env_t(d); fr = f(m)
    return (np.sin(2*np.pi*fr*t) + .25*np.sin(2*np.pi*fr*2*t)) * np.minimum(1, t*60) * np.exp(-t*1.8)
def pad(ms, d):
    t = env_t(d)
    x = sum(np.sin(2*np.pi*f(m)*t) + .5*np.sin(2*np.pi*f(m)*1.003*t) for m in ms) / len(ms)
    return x * np.minimum(1, t*1.5) * np.minimum(1, (d - t)*2)
def brush(d=.12):
    t = env_t(d); x = rng.standard_normal(len(t)).astype(np.float32); x = np.diff(x, prepend=0)
    return x * np.exp(-t*35)
def kick():
    t = env_t(.35); ph = 2*np.pi*np.cumsum(45 + 70*np.exp(-t*30)) / SR
    return np.sin(ph) * np.exp(-t*10)

CH = [(41, [65, 69, 72, 76]), (38, [62, 65, 69, 72]), (46, [65, 70, 74, 77]), (48, [64, 67, 72, 76])]
ARP = [0, 2, 1, 3, 2, 1]                  # 3/4 hissi veren 6'lı arpej (sekizlikler)
MEL = [[81, None, 79, 77, None, None], [77, None, 76, 74, None, None], [74, None, 77, 81, None, 79], [79, None, None, 76, None, None]]
bar = 3 * beat; t0 = 0.0; k = 0
while t0 < total + 1:
    root, tones = CH[k % 4]
    add(pad([m - 12 for m in tones[:3]], bar + .3), t0, 0, .16)
    for j in range(6):
        add(musicbox(tones[ARP[j]] + 12, 1.0), t0 + j * beat / 2, .3 if j % 2 else -.3, .12)
    add(bass(root, bar), t0, 0, .35)
    add(bass(root + 7, beat * 1.5), t0 + 2 * beat, 0, .2)
    if k >= 2:
        add(kick(), t0, 0, .25)
        for j in range(3): add(brush(), t0 + j * beat, .15, .05 if j else .03)
    if k >= 4:
        for j, m in enumerate(MEL[k % 4]):
            if m: add(musicbox(m + 12, 1.6), t0 + j * beat / 2, 0, .17)
    t0 += bar; k += 1

sm = np.stack([L, R], 1)[:int(total * SR)]
sm /= np.abs(sm).max() + 1e-9
fi, fo = int(.6 * SR), int(2.0 * SR)
sm[:fi] *= np.linspace(0, 1, fi)[:, None]; sm[-fo:] *= np.linspace(1, 0, fo)[:, None]
save(f'{HERE}/music.wav', (sm * .9).reshape(-1), ch=2)
print('müzik hazır')
