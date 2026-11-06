// Kullanım: node render.js [cikti.mp4]            -> tam video (audio/ varsa ses + müzik dahil)
//           node render.js --stills 1,3,7 dir      -> belirli saniyelerden kare (orijinal animasyon zamanı)
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  await page.goto('file://' + path.resolve(__dirname, 'index.html') + '?render=1');
  await page.waitForFunction(() => window.READY === true);
  const grab = async (t, q) => {
    const d = await page.evaluate(([t, q]) => { render(t); return cv.toDataURL('image/jpeg', q); }, [t, q]);
    return Buffer.from(d.split(',')[1], 'base64');
  };

  if (process.argv[2] === '--stills') {
    const times = process.argv[3].split(',').map(Number);
    const dir = process.argv[4];
    fs.mkdirSync(dir, { recursive: true });
    for (const t of times) fs.writeFileSync(path.join(dir, `t${String(t).padStart(5, '0')}.jpg`), await grab(t, 0.8));
    await browser.close();
    return;
  }

  const out = process.argv[2] || path.resolve(__dirname, 'alti_sifir_short.mp4');
  const FPS = 30;
  // audio/timemap.json varsa: video süresi seslendirmeye göre, animasyon zamanı çapalarla eşlenir
  const A_DIR = path.resolve(__dirname, 'audio');
  const mapFile = path.join(A_DIR, 'timemap.json');
  const tm = fs.existsSync(mapFile) ? JSON.parse(fs.readFileSync(mapFile, 'utf8')) : null;
  const warp = t => {
    if (!tm) return t;
    const A = tm.anchors;
    for (let i = 0; i < A.length - 1; i++)
      if (t <= A[i + 1][0]) return A[i][1] + (t - A[i][0]) / (A[i + 1][0] - A[i][0]) * (A[i + 1][1] - A[i][1]);
    return A[A.length - 1][1];
  };
  const dur = tm ? tm.duration : await page.evaluate(() => DUR);
  const N = Math.round(dur * FPS);
  const silent = tm ? path.join(A_DIR, '_video_only.mp4') : out;

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < N; i++) {
    const buf = await grab(Math.min(warp(i / FPS), 44.99), 0.95);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`kare ${i}/${N}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();

  if (tm) {
    // Ses: konuşma ~-14.5 LUFS'a yükseltilir, müzik ~14 dB altında ve konuşurken ayrıca kısılır (sidechain)
    const fc = [
      `[1:a]aformat=channel_layouts=stereo,apad=whole_dur=${dur},volume=2.72,asplit=2[v1][v2]`,
      '[2:a]volume=0.24[m]',
      '[m][v2]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[md]',
      '[v1][md]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.89,aresample=48000[a]',
    ].join(';');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', path.join(A_DIR, 'voice_trim.wav'), '-i', path.join(A_DIR, 'music.wav'),
      '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(dur),
      '-movflags', '+faststart', out], { stdio: 'inherit' });
    fs.unlinkSync(silent);
  }
  console.log('bitti:', out);
})();
