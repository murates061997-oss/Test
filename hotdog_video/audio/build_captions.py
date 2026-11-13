"""transcript.json -> captions.json (kısa, okunabilir altyazı parçaları; Whisper yazım hataları düzeltilir)."""
import json, re
HERE = __file__.rsplit('/', 1)[0]
FIX = [("Ben's plane", "Ben's Plain"), ("first pitches", "first pitch is"), ("dad dogs too", "Dad Dogs Too"),
       ("dad dogs again", "Dad Dogs Again"), ("dad dogs", "Dad Dogs"), ("let's know how many were getting", "let's know how many we're getting"),
       ("$3840", "$3,840"), ("$1210", "$1,210"), ("9.45", "9:45"), ("5.30", "5:30"), ("11.03", "11:03"), ("Last, outdoor", "Last outdoor"),
       ("farmer's market", "farmers market"), ("Yep, he finished it", "Yep. He finished it")]
segs = json.load(open(f'{HERE}/transcript.json'))
out = []
for s in segs:
    words = [(a, b, w) for a, b, w in s['words']]   # Whisper kelimeleri baştaki boşluğu taşır
    full = ''.join(w for _, _, w in words).strip()
    n = max(1, -(-len(full) // 46)); target = len(full) / n
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(w); L = len(''.join(x[2] for x in cur).strip())
        left = len(''.join(x[2] for x in words[i + 1:]).strip())
        if len(chunks) < n - 1 and left > 8 and (L >= target or (L >= target * .7 and w[2].rstrip().endswith(','))):
            chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    for c in chunks:
        t = ''.join(x[2] for x in c).strip()
        for a, b in FIX: t = t.replace(a, b)
        out.append({'a': round(c[0][0], 2), 'b': round(c[-1][1], 2), 'text': t})
# boşlukları kapat: bir sonraki altyazıya kadar (en fazla 1.2 sn) ekranda kalsın
for i, c in enumerate(out):
    nxt = out[i + 1]['a'] if i + 1 < len(out) else c['b'] + 1.5
    c['b'] = round(min(nxt, c['b'] + 1.2), 2)
json.dump(out, open(f'{HERE}/captions.json', 'w'), indent=0, ensure_ascii=False)
open(f'{HERE}/captions.js', 'w').write('window.CAPTIONS = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(len(out), 'parça; en uzun:', max(len(c['text']) for c in out))
