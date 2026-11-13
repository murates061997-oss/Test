"""Telifsiz, tamamen sentezlenmiş fon müziği (akustik gitar Karplus-Strong + bas + shaker + çan melodisi).
Hikâyenin hüzünlü bölümlerinde (yağmurlu festival, eve dönüş, son maç öncesi) davul/melodi çekilir.
Çıktı: music.wav (stereo, 44.1 kHz)"""
import wave
import numpy as np
SR = 44100
HERE = __file__.rsplit('/', 1)[0]
TOTAL = 594.0
CALM = [(286, 314), (417, 435), (517, 546)]      # sakin bölümler (sn)
BPM = 92; beat = 60 / BPM
n = int((TOTAL + 2) * SR)
L = np.zeros(n, np.float32); R = np.zeros(n, np.float32)
rng = np.random.default_rng(11)
f = lambda m: 440 * 2 ** ((m - 69) / 12)
def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= n: return
    sig = sig[:n - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2); R[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2)
_c = {}
def pluck(m, d=1.3):
    if m in _c: return _c[m]
    N = int(SR / f(m)); buf = rng.uniform(-1, 1, N).astype(np.float32)
    out = np.zeros(int(d * SR), np.float32); idx = 0
    for i in range(len(out)):
        x = buf[idx]; out[i] = x; buf[idx] = .5 * (x + buf[(idx + 1) % N]) * .997; idx = (idx + 1) % N
    out *= np.minimum(1, np.arange(len(out)) / 60)
    _c[m] = out / (np.abs(out).max() + 1e-9); return _c[m]
tt = lambda d: np.arange(int(d * SR)) / SR
def bass(m, d): t = tt(d); return (np.sin(2*np.pi*f(m)*t) + .25*np.sin(4*np.pi*f(m)*t)) * np.minimum(1, t*80) * np.exp(-t*2.2)
def shaker(d=.06): t = tt(d); x = np.diff(rng.standard_normal(len(t)).astype(np.float32), prepend=0); return x * np.sin(np.pi * t / d)
def bell(m, d=1.6): t = tt(d); return (np.sin(2*np.pi*f(m)*t) + .3*np.sin(2*np.pi*f(m)*2.76*t)*np.exp(-t*6)) * np.exp(-t*2.8) * np.minimum(1, t*300)
def kick(): t = tt(.25); return np.sin(2*np.pi*(55 + 70*np.exp(-t*30))*t) * np.exp(-t*14)
# G - D - Em - C  /  ara bölüm: Em - C - G - D
A = [(43, [55, 59, 62, 67, 71]), (38, [50, 57, 62, 66, 69]), (40, [52, 55, 59, 64, 67]), (36, [48, 55, 60, 64, 67])]
B = [(40, [52, 55, 59, 64, 67]), (36, [48, 55, 60, 64, 67]), (43, [55, 59, 62, 67, 71]), (38, [50, 57, 62, 66, 69])]
PAT = [0, 2, 1, 3, 2, 4, 3, 2]
MEL_A = [[74, None, 71, None, 74, 76, None, None], [74, None, None, 69, None, None, 66, None], [67, None, 71, None, 76, None, 74, None], [72, None, None, 71, 67, None, None, None]]
MEL_B = [[71, None, 67, None, 64, None, 67, None], [72, None, 71, None, 67, None, None, None], [74, None, 71, None, 67, 71, None, None], [69, None, 66, None, 62, None, None, None]]
bar = 4 * beat; t0 = 0.0; k = 0
while t0 < TOTAL:
    calm = any(a - 1 <= t0 <= b for a, b in CALM)
    sec = (k // 16) % 3          # 16 ölçüde bir değişen bölüm (A, A, B)
    prog, mel = (B, MEL_B) if sec == 2 else (A, MEL_A)
    root, tones = prog[k % 4]
    for j in range(8):
        if calm and j % 2: continue
        add(pluck(tones[PAT[j]]), t0 + j * beat / 2 + .01 * (j % 2), -.3 if j % 2 else .3, .2)
    add(bass(root, beat * 2), t0, 0, .38); add(bass(root + 7, beat * 1.5), t0 + 2 * beat, 0, .26)
    if not calm and k >= 2:
        for j in range(8): add(shaker(), t0 + j * beat / 2, .35, .045 if j % 2 else .025)
        add(kick(), t0, 0, .22); add(kick(), t0 + 2 * beat, 0, .16)
    if not calm and k >= 4 and (k // 8) % 2 == 1:
        for j, m in enumerate(mel[k % 4]):
            if m: add(bell(m), t0 + j * beat / 2, .1, .13)
    t0 += bar; k += 1
sm = np.stack([L, R], 1)[:int(TOTAL * SR)]
sm /= np.abs(sm).max() + 1e-9
fi, fo = int(1.0 * SR), int(5.0 * SR)
sm[:fi] *= np.linspace(0, 1, fi)[:, None]; sm[-fo:] *= np.linspace(1, 0, fo)[:, None]
x = np.clip(sm * .9, -1, 1)
with wave.open(f'{HERE}/music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
print('music.wav hazır', round(len(x) / SR, 1), 'sn')
